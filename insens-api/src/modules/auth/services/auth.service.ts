import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService }    from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt       from 'bcryptjs';
import * as crypto       from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto }    from '../dtos/register.dto';
import { LoginDto }       from '../dtos/login.dto';
import { UserRole }       from '../../../common/constants/roles.constant';
import type { JwtPayload }     from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo:       AuthRepository,
    private readonly jwtService:     JwtService,
    private readonly configService:  ConfigService,
  ) {}

  // ── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.authRepo.findUserByEmail(dto.email);
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.authRepo.createUser({
      email:           dto.email,
      passwordHash,
      authProvider:    'local',
      status:          'active',
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    // Create profile if names provided
    await this.authRepo.createProfile({
      userId:    user.id,
      firstName: dto.firstName ?? null,
      lastName:  dto.lastName  ?? null,
    });

    // Assign the requested role — only vendor_owner is accepted, otherwise customer
    const roleCode = dto.role === UserRole.VENDOR_OWNER ? UserRole.VENDOR_OWNER : UserRole.CUSTOMER;
    const roleRow  = await this.authRepo.findRoleByCode(roleCode);
    if (roleRow) {
      await this.authRepo.assignRole(user.id, roleRow.id);
    }

    return this.issueTokens(user.id, user.email!, [roleCode], null);
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    
    const user = await this.authRepo.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        code:    'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException({
        code:    'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException({
        code:    'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      throw new ForbiddenException({
        code:    'FORBIDDEN',
        message: 'Your account has been deactivated',
      });
    }

    // Lookup roles and vendorId in parallel
    const [roles, vendorId] = await Promise.all([
      this.authRepo.getUserRoleCodes(user.id),
      this.authRepo.getVendorIdForUser(user.id),
    ]);

    await this.authRepo.updateLastLogin(user.id);

    return this.issueTokens(user.id, user.email!, roles, vendorId);
  }

  // ── Refresh ───────────────────────────────────────────────────────────────

  async refresh(rawRefreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(rawRefreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID', message: 'Invalid refresh token' });
    }

    const tokenHash   = this.hashToken(rawRefreshToken);
    const storedToken = await this.authRepo.findRefreshToken(payload.sub, tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_EXPIRED', message: 'Refresh token expired or already used' });
    }

    // Rotate: delete old token, issue new pair
    await this.authRepo.deleteRefreshToken(storedToken.id);

    return this.issueTokens(payload.sub, payload.email, payload.roles, payload.vendorId);
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string, rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash   = this.hashToken(rawRefreshToken);
      const storedToken = await this.authRepo.findRefreshToken(userId, tokenHash);
      if (storedToken) {
        await this.authRepo.deleteRefreshToken(storedToken.id);
      }
    } else {
      await this.authRepo.deleteAllRefreshTokensForUser(userId);
    }
    return { message: 'Logged out successfully' };
  }

  // ── Me ────────────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    const [user, profile, roles, vendorId] = await Promise.all([
      this.authRepo.findUserById(userId),
      this.authRepo.findProfile(userId),
      this.authRepo.getUserRoleCodes(userId),
      this.authRepo.getVendorIdForUser(userId),
    ]);

    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID', message: 'User not found' });
    }

    const { passwordHash: _pw, ...safeUser } = user;

    return {
      ...safeUser,
      firstName: profile?.firstName ?? null,
      lastName:  profile?.lastName  ?? null,
      roles,
      vendorId,
    };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async issueTokens(
    userId:   string,
    email:    string,
    roles:    string[],
    vendorId: string | null,
  ) {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { sub: userId, email, roles, vendorId };

    const accessExpiresIn  = this.configService.get<string>('jwt.accessExpiresIn',  '15m');
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const secret           = this.configService.get<string>('jwt.secret')!;

    const accessToken  = this.jwtService.sign(payload, { expiresIn: accessExpiresIn,  secret });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiresIn, secret });

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = this.parseExpiry(refreshExpiresIn);

    await this.authRepo.createRefreshToken({ userId, tokenHash, expiresAt });

    const [user, profile] = await Promise.all([
      this.authRepo.findUserById(userId),
      this.authRepo.findProfile(userId),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id:        user!.id,
        email:     user!.email,
        firstName: profile?.firstName ?? null,
        lastName:  profile?.lastName  ?? null,
        roles,
        vendorId,
      },
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiry(duration: string): Date {
    const now  = Date.now();
    const unit = duration.slice(-1);
    const val  = parseInt(duration.slice(0, -1), 10);
    const ms: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };
    return new Date(now + val * (ms[unit] ?? 60_000));
  }
}
