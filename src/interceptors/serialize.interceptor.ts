import {CallHandler, ExecutionContext, NestInterceptor, UseInterceptors} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {ClassConstructor, plainToClass} from "class-transformer";
import {UserDto} from "../users/response-dto/user.dto";

export function Serialize<T>(dto:ClassConstructor<T>){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor<T> implements NestInterceptor {
    constructor (private dto:ClassConstructor<T>){}
    intercept(context:ExecutionContext, handler: CallHandler):Observable<T> {
        // Request handler에 도달하기전 할 일

        // Response가 클라이언트에 도달하기 전 할 일
        return handler.handle().pipe(
            map((data:any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues:true
                })
            })
        )
    }
}
