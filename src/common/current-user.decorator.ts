import { SetMetadata } from '@nestjs/common';

export const CurrentUser = (...args: string[]) =>
  SetMetadata('current-user', args);
