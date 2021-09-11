import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
    Session
} from '@nestjs/common';
import { CreateUserDto } from './request-dto/create-user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {UsersService} from './users.service'
import {UpdateUserDto} from "./request-dto/update-user.dto";
import {Serialize, SerializeInterceptor} from "../interceptors/serialize.interceptor";
import {UserDto} from "./response-dto/user.dto";
import {AuthService} from "./auth.service";
import {User} from "./user.entity";
import {CurrentUser} from "./decorator/current-user-decorator";

@Serialize(UserDto)
@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(
      private usersService:UsersService,
      private authService: AuthService
  ){}

  // @Get('/me')
  // async me(@Session() session:any){
  //   const user = await this.usersService.findOne(session.userId)
  //   if(!user) throw new NotFoundException("user doesn't exist")
  //   return user
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user:User){
    return user;
  }

  @ApiOperation({summary:'Create a new user'})
  @ApiResponse({status:201, description:'회원가입 완료'})
  @Post('/signup')
  async signUp(@Body() body:CreateUserDto, @Session() session:any ){
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }
  @Post('/signin')
  async signIn(@Body() body:CreateUserDto, @Session() session:any){
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    console.log(session)
    return user
  }
  @Get('/signout')
  signOut(@Session() session){
    session.userId = null;
  }

  @ApiOperation({summary:'Find a user with given id'})
  @Get('/:id')
  async findUser(
      @Param('id')
      id:string
  ){
    const user = await this.usersService.findOne(parseInt(id))
    if(!user){
      throw new NotFoundException('user not found!')
    }
    return user
  }

  @ApiOperation({summary:'Find all users with given email', })
  @Get()
  findAllUsers(
      @Query('email')
      email:string
  ){
    return this.usersService.find(email)
  }

  @ApiOperation({summary:'Update a user with given id'})
  @Patch('/:id')
  updateUser(
      @Param('id') id:string,
      @Body() body: UpdateUserDto
  ){
    return this.usersService.update(parseInt(id), body)
  }

  @ApiOperation({summary:'Remove user with given id'})
  @Delete('/:id')
  removeUser(
      @Param('id')
      id:string
  ){
    return this.usersService.remove(parseInt(id))
  }
}
