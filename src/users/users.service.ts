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

  findOne(id:number){
    if(!id){
      return null
    }
    return this.repo.findOne(id)
  }
  find(email:string){
    return this.repo.find({email})
  }
  // attrs: email 또는 password 또는 둘다 받을 수 있게 타입 설정
  // update를 통해 직접 수정할 수 있지만, save의 기능을 활용하기 위해 우회해서 업데이트
  async update(id:number, attrs:Partial<User>){
    const user = await this.findOne(id)
    if(!user) throw new Error('user not found');
    Object.assign(user, attrs)
    return this.repo.save(user)
  }
  // 마찬가지로 entity를 받아와서 사용해야 remove의 기능을 활용할 수 있음.
  async remove(id:number){
    const user = await this.findOne(id);
    if(!user) throw new Error;
    return this.repo.remove(user)
  }
}
