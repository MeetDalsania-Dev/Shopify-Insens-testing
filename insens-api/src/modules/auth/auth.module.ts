import { Module }        from '@nestjs/common';
import { JwtModule }     from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController }  from './controllers/auth.controller';
import { AuthService }     from './services/auth.service';
import { AuthRepository }  from './repositories/auth.repository';
import { JwtStrategy }     from './strategies/jwt.strategy';
import { DatabaseModule }  from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.accessExpiresIn', '15m') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, AuthRepository, JwtStrategy],
  exports:     [JwtModule, PassportModule],
})
export class AuthModule {}
