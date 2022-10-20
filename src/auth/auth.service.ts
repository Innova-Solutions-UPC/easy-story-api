import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { LoginEmailDto } from './dto/login-email.dto';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterEmailDto } from './dto/register-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * We're using the findOneByEmail function from the UsersService to find a user by their email
   * address. If the user doesn't exist, we throw an UnauthorizedException. If the user does exist, we
   * use the argon2 library to verify the user's password. If the password is incorrect, we throw an
   * UnauthorizedException. If the password is correct, we use the JWT service to sign a JWT token with
   * the user's username, email, and id. We return the token and the user
   * @param {LoginEmailDto} loginEmailDto - LoginEmailDto
   * @returns {
   *     tokens: { accessToken: accessToken },
   *     authenticatedUser: user,
   *   }
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
    const accessToken = this.jwtService.sign({
      username: user.username,
      email: user.email,
      sub: user.id,
    });
    return {
      tokens: { accessToken: accessToken },
      authenticatedUser: user,
    };
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
    return this.usersService.update(user.username, { password: newPassword });
  }

  /**
   * It takes a user and an updateUserDto, and returns a promise of a user
   * @param {User} user - User - This is the user object that we get from the @GetUser decorator.
   * @param updateUserDto - This is the DTO that we will use to update the user.
   * @returns The updated user
   */
  updateUser(user: User, updateUserDto): Promise<User> {
    return this.usersService.update(user.username, { ...updateUserDto });
  }

  /**
   * It returns a promise that resolves to a user
   * @param {User} user - User - the user object that is passed in from the request
   * @returns A promise of a user object.
   */
  async getCurrentUser(currentUser: User) {
    const user = await this.usersService.findOne(currentUser.username);
    return { authenticatedUser: user };
  }
}
