import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'Easy Story API',
      version: '1',
      message: 'Hello World!',
    };
  }
}
