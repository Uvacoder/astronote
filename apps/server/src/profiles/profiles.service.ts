import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto, user: User) {
    const { bio } = createProfileDto;
    return this.prisma.profile.create({
      data: {
        user: { connect: { id: user.id } },
        bio,
      },
    });
  }

  findAll(user: User) {
    if (user.role === "USER") throw new ForbiddenException();
    return this.prisma.profile.findMany();
  }

  async findOne(id: string, user: User) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw new NotFoundException("Profile not found!");
    }

    if (user.role === "USER" && user.id !== profile.userId) {
      throw new ForbiddenException();
    }

    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, user: User) {
    const { bio } = updateProfileDto;
    const profile = await this.prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw new NotFoundException("Profile not found!");
    }

    if (user.role === "USER" && profile.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to update this profile"
      );
    }

    return this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        bio,
      },
    });
  }

  async remove(id: string, user: User) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw new NotFoundException("Profile not found!");
    }

    if (user.role !== "ADMIN" && profile.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to delete this profile"
      );
    }

    return this.prisma.profile.delete({ where: { id } });
  }
}
