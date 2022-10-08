import {
  Request,
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("current")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    throw new NotImplementedException();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getOne(@Param("id") id: string, @Request() req): Promise<User> {
    return this.userService.findOne(id, req.user);
  }

  @Post()
  createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateOne(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @Request() req
  ): Promise<User> {
    return this.userService.updateUser(id, dto, req.user);
  }
}
