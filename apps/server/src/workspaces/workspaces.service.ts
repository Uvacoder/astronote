import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./dto";

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string, user: User) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id,
      },
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    if (user.role === "USER" && workspace.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to view this workspace"
      );
    }
    return workspace;
  }

  async findAll(user: User) {
    return this.prisma.workspace.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async create(createWorkspaceDto: CreateWorkspaceDto, user: User) {
    const { name, description, emoji, color } = createWorkspaceDto;
    const workspace = await this.prisma.workspace.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name,
        description,
        emoji,
        color,
      },
    });

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto, user: User) {
    const { name, description, emoji, color } = updateWorkspaceDto;
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) throw new NotFoundException();

    if (user.role === "USER" && workspace.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to update this workspace"
      );
    }

    return await this.prisma.workspace.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        emoji,
        color,
      },
    });
  }

  async delete(id: string, user: User) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) throw new NotFoundException();

    if (user.role !== "ADMIN" && workspace.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to delete this workspace"
      );
    }

    return this.prisma.workspace.delete({
      where: {
        id,
      },
    });
  }
}
