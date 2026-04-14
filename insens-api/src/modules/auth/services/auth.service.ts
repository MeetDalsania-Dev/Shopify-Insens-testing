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
      email:     dto.email,
      password:  passwordHash,
      role:      dto.role,
      firstName: dto.firstName ?? null,
      lastName:  dto.lastName  ?? null,
    });

    return this.issueTokens(user.id, user.email, user.role as any, null);
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

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException({
        code:    'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        code:    'FORBIDDEN',
        message: 'Your account has been deactivated',
      });
    }

    // Resolve shopId for SHOP_OWNER from the shops table (handled in auth module via repo)
    const shopId = (user as any).shopId ?? null;

    return this.issueTokens(user.id, user.email, user.role as any, shopId);
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

    return this.issueTokens(payload.sub, payload.email, payload.role, payload.shopId);
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
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID', message: 'User not found' });
    }
    const { password: _pw, ...safe } = user;
    return safe;
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async issueTokens(
    userId:  string,
    email:   string,
    role:    JwtPayload['role'],
    shopId:  string | null,
  ) {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { sub: userId, email, role, shopId };

    const accessExpiresIn  = this.configService.get<string>('jwt.accessExpiresIn',  '15m');
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const secret           = this.configService.get<string>('jwt.secret')!;

    const accessToken  = this.jwtService.sign(payload, { expiresIn: accessExpiresIn,  secret });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiresIn, secret });

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = this.parseExpiry(refreshExpiresIn);

    await this.authRepo.createRefreshToken({ userId, tokenHash, expiresAt });

    const user = await this.authRepo.findUserById(userId);

    return {
      accessToken,
      refreshToken,
      user: {
        id:        user!.id,
        email:     user!.email,
        role:      user!.role,
        firstName: user!.firstName,
        lastName:  user!.lastName,
        shopId,
      },
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiry(duration: string): Date {
    const now = Date.now();
    const unit = duration.slice(-1);
    const val  = parseInt(duration.slice(0, -1), 10);
    const ms: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };
    return new Date(now + val * (ms[unit] ?? 60_000));
  }
}
