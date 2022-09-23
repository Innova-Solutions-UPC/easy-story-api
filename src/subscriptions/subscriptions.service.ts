import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private usersService: UsersService,
  ) {}

  /**
   * If the user is not subscribed to the user they are trying to subscribe to, create a new
   * subscription and save it to the database
   * @param {User} currentUser - User - the user who is currently logged in
   * @param {CreateSubscriptionDto} createSubscriptionDto - CreateSubscriptionDto
   * @returns A subscription object
   */
  async create(
    currentUser: User,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    if (currentUser.username === createSubscriptionDto.username) {
      throw new BadRequestException(
        'You cannot subscribe to yourself. That would be weird.',
      );
    }
    const existingSubscription = await this.subscriptionsRepository.findOne({
      relations: {
        user: true,
        subscriber: true,
      },
      where: {
        user: { username: createSubscriptionDto.username },
        subscriber: { id: currentUser.id },
      },
    });
    if (existingSubscription) {
      throw new BadRequestException('You are already subscribed to this user');
    }
    const user = await this.usersService.findOne(
      createSubscriptionDto.username,
    );
    const subscription = this.subscriptionsRepository.create({
      user: user,
      subscriber: { ...currentUser },
    });
    return this.subscriptionsRepository.save(subscription);
  }

  /**
   * It returns a paginated list of subscriptions for a given user, optionally filtered by a subscriber
   * @param {IPaginationOptions} options - IPaginationOptions - This is the options object that is
   * passed to the paginate function.
   * @param {string} username - The username of the user whose subscriptions we want to find.
   * @param {string} [subscriber] - string,
   * @returns A paginated list of subscriptions.
   */
  findAll(
    options: IPaginationOptions,
    username: string,
    subscriber?: string,
  ): Promise<Pagination<Subscription>> {
    return paginate<Subscription>(this.subscriptionsRepository, options, {
      where: {
        user: { username: username },
        ...(subscriber && { subscriber: { username: subscriber } }),
      },
      relations: {
        user: true,
        subscriber: true,
      },
    });
  }

  findOneByUserAndSubscriber(username: string, subscriber: User) {
    return this.subscriptionsRepository.findOneBy({
      user: { username: username },
      subscriber: { id: subscriber.id },
    });
  }

  async remove(userUsername: string, subscriber: User) {
    const subscription = await this.findOneByUserAndSubscriber(
      userUsername,
      subscriber,
    );
    if (!subscription) {
      throw new BadRequestException(
        'You are not subscribed to this user. You cannot unsubscribe.',
      );
    }
    return this.subscriptionsRepository.remove(subscription);
  }
}
