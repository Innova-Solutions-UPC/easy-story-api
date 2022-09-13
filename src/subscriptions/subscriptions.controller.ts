import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../common/public.decorator';

@ApiTags('Subscriptions')
@Controller({
  path: 'subscriptions',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @CurrentUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(user, createSubscriptionDto);
  }

  @Get()
  @Public()
  @ApiQuery({
    name: 'subscriber',
    required: false,
    type: String,
    description: 'The username of the user who is subscribed to the user',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
    @Query('username') username: string,
    @Query('subscriber') subscriber?: string,
  ) {
    return this.subscriptionsService.findAll(
      {
        page,
        limit,
        route: '/v1/subscriptions',
      },
      username,
      subscriber,
    );
  }

  @Delete()
  @ApiBearerAuth()
  remove(@Query('user') username: string, @CurrentUser() user: User) {
    return this.subscriptionsService.remove(username, user);
  }
}
