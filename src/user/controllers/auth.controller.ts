import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UserSignupDto } from '../dto/user-signup.dto';
import { Serialize } from '../../intercepters/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../user.entity';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() body: UserSignupDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.service.signUp(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Post('signin')
  async signIn(
    @Body() body: UserSignupDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.service.signIn(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Get('whoami')
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Session() session: Record<string, any>) {
    session.userId = null;
  }
}
