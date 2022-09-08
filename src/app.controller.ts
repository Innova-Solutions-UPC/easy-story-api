import { Controller, Get } from '@nestjs/common';
import { Public } from './common/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello() {
    return {
      name: 'Easy Story API',
      version: '1',
      message: 'Hello World! 😜👋',
    };
  }
}
