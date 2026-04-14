import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags }       from '@nestjs/swagger';
import { AuthService }   from '../services/auth.service';
import { RegisterDto }   from '../dtos/register.dto';
import { LoginDto }      from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { Public }          from '../../../core/decorators/public.decorator';
import { CurrentUser }     from '../../../core/decorators/current-user.decorator';
import type { JwtPayload }      from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: JwtPayload, @Body() body: Partial<RefreshTokenDto>) {
    return this.authService.logout(user.sub, body.refreshToken);
  }

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }
}
