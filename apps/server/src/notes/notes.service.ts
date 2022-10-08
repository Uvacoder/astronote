import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Note, User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto";

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const { workspaceId, notebookId } = createNoteDto;

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    if (user.role === "USER" && workspace.userId !== user.id) {
      throw new ForbiddenException(
        "You are not allowed to create note inside this workspace"
      );
    }

    if (notebookId) {
      const notebook = await this.prisma.notebook.findUnique({
        where: { id: notebookId },
      });
      if (!notebook) {
        throw new NotFoundException("Notebook not found");
      }
      if (
        (user.role === "USER" && notebook.userId !== user.id) ||
        notebook.workspaceId !== workspaceId
      ) {
        throw new ForbiddenException(
          "You are not allowed to create note inside this notebook"
        );
      }
    }

    return this.prisma.note.create({
      data: { ...createNoteDto, userId: user.id },
    });
  }

  findAll(workspaceId: string, user: User): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { AND: [{ userId: user.id }, { workspaceId }] },
    });
  }

  async findOne(id: string, user: User) {
    const note = await this.prisma.note.findUnique({ where: { id } });

    if (!note) throw new NotFoundException("Note not found");

    if (user.role === "USER" && note.userId !== user.id) {
      throw new ForbiddenException("You are not allowed to view this note.");
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, user: User) {
    const note = await this.prisma.note.findUnique({ where: { id } });

    if (!note) throw new NotFoundException("Note not found");

    if (user.role === "USER" && note.userId !== user.id) {
      throw new ForbiddenException("You are not allowed to update this note.");
    }

    return this.prisma.note.update({
      where: { id },
      data: { ...updateNoteDto },
    });
  }

  async remove(id: string, user: User) {
    const note = await this.prisma.note.findUnique({ where: { id } });

    if (!note) throw new NotFoundException("Note not found");

    if (user.role !== "ADMIN" && note.userId !== user.id) {
      throw new ForbiddenException("You are not allowed to delete this note.");
    }

    return this.prisma.note.delete({ where: { id } });
  }
}
