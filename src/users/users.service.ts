import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  /**
   * The constructor function is used to inject the User repository into the UsersService class
   * @param usersRepository - Repository<User>
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * It creates a new user, but first checks if the email is already in use
   * @param {CreateUserDto} createUserDto - CreateUserDto - This is the DTO that we created earlier.
   * @returns The user object is being returned.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existentUser = await this.findOneByEmail(
      createUserDto.email.toLowerCase(),
    );
    if (existentUser) {
      throw new BadRequestException('Email is already in use');
    }
    const user = this.usersRepository.create({
      email: createUserDto.email.toLowerCase(),
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      username: createUserDto.username,
      verified: true,
      password: await argon2.hash(createUserDto.password),
    });
    return this.usersRepository.save(user);
  }

  /**
   * Find all users, paginate them, and return a promise of a paginated result.
   * @param {IPaginationOptions} options - IPaginationOptions
   * @returns A promise of a pagination object.
   */
  findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options);
  }

  /**
   * It finds a user by id, and if it doesn't find one, it throws a BadRequestException
   * @param {number} id - number - the id of the user we want to find
   * @returns The user object
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User number #${id} not found`);
    }
    return user;
  }

  /**
   * Find a user by email and return it as a promise.
   * @param {string} email - The email of the user we want to find.
   * @returns A promise of a user
   */
  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * It takes an id and an updateUserDto, preloads the user with the id and the updateUserDto, throws
   * an error if the user doesn't exist, and then saves the user
   * @param {number} id - number - the id of the user to update
   * @param {UpdateUserDto} updateUserDto - UpdateUserDto
   * @returns The user object
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new BadRequestException(`User number #${id} not found`);
    }
    return this.usersRepository.save(user);
  }

  /**
   * It finds a user by id, then removes it
   * @param {number} id - number - the id of the user we want to remove
   * @returns The user that was removed.
   */
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
