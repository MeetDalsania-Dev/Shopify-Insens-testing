import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService }     from '../services/auth.service';
import { RegisterDto }     from '../dtos/register.dto';
import { LoginDto }        from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { Public }          from '../../../core/decorators/public.decorator';
import { CurrentUser }     from '../../../core/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new account. Customer role is auto-assigned.' })
  @ApiResponse({ status: 201, description: 'User registered successfully — returns tokens and user info' })
  @ApiResponse({ status: 400, description: 'Validation error (invalid email, short password, etc.)' })
  @ApiResponse({ status: 409, description: 'Email already taken' })
  register(@Body() dto: RegisterDto) {
   
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns access token, refresh token, and user info' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
     
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token', description: 'Exchange a valid refresh token for a new token pair' })
  @ApiResponse({ status: 200, description: 'Returns new access token and refresh token' })
  @ApiResponse({ status: 401, description: 'Refresh token invalid or expired' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout — revoke the current refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@CurrentUser() user: JwtPayload, @Body() body: Partial<RefreshTokenDto>) {
    return this.authService.logout(user.sub, body.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user', description: 'Returns profile, roles[], and vendorId' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }
}
