import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, viewer: User): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (viewer.role === "USER" && viewer.id !== user.id) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...result } = user;

    return result as User;
  }

  async findMany(viewer: User): Promise<User[]> {
    if (viewer.role === "USER") throw new UnauthorizedException();

    return this.prisma.user.findMany();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, name, username, password } = dto;

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        username,
        password,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...result } = user;

    return result as User;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    editor: User
  ): Promise<User> {
    const { name, username } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();

    if (editor.role === "USER" && editor.id !== user.id) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        username,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...result } = updatedUser;

    return result as User;
  }

  async deleteUser(id: string, editor: User) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();

    if (editor.role !== "ADMIN" && editor.id !== user.id) {
      throw new UnauthorizedException();
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...result } = deletedUser;

    return result as User;
  }
}
