import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/public.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Authentication & Authorization')
@Controller({
  path: 'auth',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new session',
  })
  async login(@Body() loginEmailDto: LoginEmailDto) {
    return this.authService.loginWithEmail(loginEmailDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  async register(@Body() registerEmailDto: RegisterEmailDto) {
    return this.authService.registerWithEmail(registerEmailDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh the access token',
  })
  async refreshSession(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(user, updateUserDto);
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current authenticated user',
  })
  async user(@CurrentUser() user: User) {
    return this.authService.getCurrentUser(user);
  }

  @Patch('user')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the current authenticated user',
  })
  async updateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(user, updateUserDto);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change the current authenticated user password',
  })
  async changePassword(@Body() registerEmailDto: RegisterEmailDto) {
    return this.authService.registerWithEmail(registerEmailDto);
  }
}
