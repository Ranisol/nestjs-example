
import {
    createParamDecorator,
    ExecutionContext
} from "@nestjs/common";



export const CurrentUser = createParamDecorator(
    (data:any, ctx: ExecutionContext) => {
        return 'hi there!'
    }
)
