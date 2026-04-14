import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto }   from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getMe(userId: string) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'User not found' });
    const { password: _pw, ...safe } = user;
    return safe;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    if (dto.email) {
      const existing = await this.usersRepo.findByEmail(dto.email);
      if (existing && existing.id !== userId) {
        throw new ConflictException({ code: 'CONFLICT', message: 'Email is already taken' });
      }
    }
    const updated = await this.usersRepo.update(userId, dto);
    const { password: _pw, ...safe } = updated;
    return safe;
  }

  async deleteMe(userId: string) {
    await this.usersRepo.softDelete(userId);
    return { message: 'Account deactivated successfully' };
  }
}
