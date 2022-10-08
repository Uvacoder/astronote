import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Notebook } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateNotebookDto, UpdateNotebookDto } from "./dto";
import { NotebooksService } from "./notebooks.service";

@Controller("notebooks")
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string, @Request() req): Promise<Notebook> {
    return this.notebooksService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req,
    @Query("workspaceId") workspaceId: string
  ): Promise<Notebook[]> {
    if (!workspaceId)
      throw new ForbiddenException("Workspace id query is required");
    return this.notebooksService.findAll(workspaceId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOne(@Body() dto: CreateNotebookDto, @Request() req): Promise<Notebook> {
    return this.notebooksService.createOne(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateOne(
    @Param("id") id: string,
    @Body() dto: UpdateNotebookDto,
    @Request() req
  ): Promise<Notebook> {
    return this.notebooksService.updateOne(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  delteOne(@Param("id") id: string, @Request() req): Promise<Notebook> {
    return this.notebooksService.deleteOne(id, req.user);
  }
}
