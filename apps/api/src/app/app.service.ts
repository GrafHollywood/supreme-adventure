import { Injectable } from '@nestjs/common';
import { Todo } from '@supreme-adventure/data';

@Injectable()
export class AppService {
  getData(): Todo {
    return { title: 'Welcome to api!' };
  }
}
