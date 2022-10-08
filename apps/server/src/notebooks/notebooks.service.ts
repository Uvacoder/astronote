import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Notebook, User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { CreateNotebookDto, UpdateNotebookDto } from "./dto";

@Injectable()
export class NotebooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string, user: User): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({ where: { id } });
    if (!notebook) {
      throw new NotFoundException();
    }

    if (user.role === "USER" && notebook.userId !== user.id) {
      throw new ForbiddenException("You are not allowed to view this notebook");
    }

    return notebook;
  }

  async findAll(workspaceId: string, user: User): Promise<Notebook[]> {
    return this.prisma.notebook.findMany({
      where: {
        user: {
          id: user.id,
        },
        workspace: {
          id: workspaceId,
        },
      },
      include: {
        _count: {
          select: {
            notebooks: true,
            notes: true,
          },
        },
      },
    });
  }

  async createOne(dto: CreateNotebookDto, user: User): Promise<Notebook> {
    const { workspaceId, name, parentId, emoji } = dto;

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to create notebook inside this workspace"
      );
    }

    if (parentId) {
      const parent = await this.findOne(parentId, user);
      if (!parent) {
        throw new NotFoundException("Parent notebook not found");
      }
      if (
        (user.role === "USER" && parent.userId !== user.id) ||
        parent.workspaceId !== workspaceId
      ) {
        throw new ForbiddenException(
          "You are not allowed to create notebook inside this notebook"
        );
      }
    }

    return this.prisma.notebook.create({
      data: {
        user: { connect: { id: user.id } },
        workspace: { connect: { id: workspaceId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
        name,
        emoji,
      },
    });
  }

  async updateOne(
    id: string,
    dto: UpdateNotebookDto,
    user: User
  ): Promise<Notebook> {
    const { name, parentId, emoji, workspaceId } = dto;
    const notebook = await this.prisma.notebook.findUnique({
      where: {
        id,
      },
    });

    if (!notebook) throw new NotFoundException();

    if (user.role === "USER" && notebook.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to update this notebook"
      );
    }

    return this.prisma.notebook.update({
      where: { id },
      data: {
        workspace: workspaceId ? { connect: { id: workspaceId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        name,
        emoji,
      },
    });
  }

  async deleteOne(id: string, user: User): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: {
        id,
      },
    });

    if (!notebook) throw new NotFoundException();

    if (user.role !== "ADMIN" && notebook.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to delete this notebook"
      );
    }

    return this.prisma.notebook.delete({ where: { id } });
  }
}
