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
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateNoteDto, GetNotesFilterDto, UpdateNoteDto } from "./dto";

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
  getNotes(@Request() req, @Query() filters: GetNotesFilterDto) {
    return this.notesService.findAll(req.user, filters);
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
