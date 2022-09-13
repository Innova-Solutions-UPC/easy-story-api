import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  /* The username of the user that we want to subscribe to */
  @IsString()
  username: string;
}
