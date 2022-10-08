import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateNoteDto, UpdateNoteDto } from "./dto";

@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query("workspaceId") workspaceId: string | null) {
    if (!workspaceId)
      throw new ForbiddenException("Workspace id query is required");
    return this.notesService.findAll(workspaceId, req.user);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string, @Request() req) {
    return this.notesService.findOne(id, req.user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req
  ) {
    return this.notesService.update(id, updateNoteDto, req.user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Request() req) {
    return this.notesService.remove(id, req.user);
  }
}
