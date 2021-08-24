import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // DI 위해서 필요. DI는 제네릭 타입 못읽음으로 필요함
    private repo: Repository<User>,
  ) {
  }

  create(email: string, password: string) {
    const user = this.repo.create({email, password});
    return this.repo.save(user );
  }
}
