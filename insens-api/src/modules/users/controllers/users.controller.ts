import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags }     from '@nestjs/swagger';
import { UsersService }  from '../services/users.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CurrentUser }   from '../../../core/decorators/current-user.decorator';
import type { JwtPayload }    from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMe(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.sub, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.deleteMe(user.sub);
  }
}
