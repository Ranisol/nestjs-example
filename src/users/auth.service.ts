import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "./users.service";
import {randomBytes ,scrypt as _scrypt} from "crypto";
import {promisify} from "util";
const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService){}
    async signup(email:string, password:string){

        // 먼저 이메일이 이미 존재하는지 확인합니다.
        const users = await this.usersService.find(email)
        if(users.length) throw new BadRequestException('email in use')

        // 패스워드에 salt, hash 과정을 거칩니다.
        const salt = randomBytes(8).toString('hex')
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = `${salt}.${hash.toString('hex')}`

        // 새로운 유저를 만들고 저장한다음 유저를 리턴합니다.
        const user = await this.usersService.create(email, result);
        return user
    }
    async signin(email:string, password:string){
         const [user] = await this.usersService.find(email)
        if(!user) throw new NotFoundException('user not found')
        const [salt, storedHash] = user.password.split('.')
        const hash = await scrypt(password, salt, 32) as Buffer
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('bad password')
        }
        return user;
    }
}
