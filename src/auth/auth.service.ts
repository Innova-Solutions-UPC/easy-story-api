import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { LoginEmailDto } from './dto/login-email.dto';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * It takes a loginEmailDto object, finds a user by email, checks if the password is valid, and if
   * so, returns a token
   * @param {LoginEmailDto} loginEmailDto - LoginEmailDto
   * @returns return this.generateTokens(user);
   */
  async loginWithEmail(loginEmailDto: LoginEmailDto) {
    const user = await this.usersService.findOneByEmail(loginEmailDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await argon2.verify(
      user.password,
      loginEmailDto.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  /**
   * It takes a RegisterEmailDto object, creates a user with it, and returns the user
   * @param {RegisterEmailDto} registerEmailDto - RegisterEmailDto
   * @returns The user object
   */
  async registerWithEmail(registerEmailDto: RegisterEmailDto): Promise<User> {
    const user = await this.usersService.create(registerEmailDto);
    return user;
  }

  /**
   * This function takes a user and a new password, and returns a promise that resolves to a user.
   * @param {User} user - User - The user object that was returned from the findOne() method.
   * @param {string} newPassword - The new password that the user wants to change to.
   * @returns A promise of a user.
   */
  changePassword(user: User, newPassword: string): Promise<User> {
    return this.usersService.update(user.id, { password: newPassword });
  }

  /**
   * It takes a user and an updateUserDto, and returns a promise of a user
   * @param {User} user - User - This is the user object that we get from the @GetUser decorator.
   * @param updateUserDto - This is the DTO that we will use to update the user.
   * @returns The updated user
   */
  updateUser(user: User, updateUserDto): Promise<User> {
    return this.usersService.update(user.id, { ...updateUserDto });
  }

  /**
   * It returns a promise that resolves to a user
   * @param {User} user - User - the user object that is passed in from the request
   * @returns A promise of a user object.
   */
  async getCurrentUser(currentUser: User) {
    const user = await this.usersService.findOne(currentUser.id);
    return { authenticatedUser: user };
  }

  /**
   * It generates a JWT access token and a JWT refresh token
   * @param {User} user - User - The user object that was returned from the database.
   * @returns An object with the accessToken, refreshToken, and authenticatedUser.
   */
  generateTokens(user: User, refreshJwt?: string) {
    const accessToken = this.jwtService.sign({
      username: user.username,
      email: user.email,
      sub: user.id,
    });
    const refreshToken = refreshJwt
      ? refreshJwt
      : this.jwtService.sign(
          {
            email: user.email,
            sub: user.id,
          },
          {
            expiresIn: '30d',
            secret: process.env.JWT_SECRET + user.password,
          },
        );
    return {
      tokens: { accessToken: accessToken, refreshToken: refreshToken },
      authenticatedUser: user,
    };
  }
  async refreshSession(refreshTokenDto: RefreshTokenDto) {
    const decodedToken = (await this.jwtService.decode(
      refreshTokenDto.refreshToken,
    )) as any;
    const user = await this.usersService.findOne(decodedToken.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const secretKey = 'Heldsansasc' + user.password;
    const isValidRefreshToken = await this.jwtService.verify(
      refreshTokenDto.refreshToken,
      {
        secret: secretKey,
      },
    );
    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.generateTokens(user, refreshTokenDto.refreshToken);
  }
}
