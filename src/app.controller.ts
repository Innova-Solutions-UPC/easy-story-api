import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/public.decorator';

@ApiTags('App Entry Point')
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
