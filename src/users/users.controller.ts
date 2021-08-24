import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {UsersService} from './users.service'
@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(private usersService:UsersService){}
  @ApiOperation({summary:'Find a user with given id'})
  @Get('/:id')
  findUser(){

  }

  @ApiOperation({summary:'Find all users with given email'})
  @Get('/?')
  findAllUsers(){

  }

  @ApiOperation({summary:'Create a new user'})
  @ApiResponse({status:201, description:'회원가입 완료'})
  @Post('/signup')
  createUser(
    @Body()
    body: CreateUserDto
  ){
    this.usersService.create(body.email, body.password)
  }

  @ApiOperation({summary:'Update a user with given id'})
  @Patch('/:id')
  updateUser(){}

  @ApiOperation({summary:'Remove user with given id'})
  @Delete('/:id')
  removeUser(){}
}
