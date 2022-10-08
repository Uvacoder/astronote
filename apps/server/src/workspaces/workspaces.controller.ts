import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./dto";
import { WorkspacesService } from "./workspaces.service";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getOne(@Param("id") id: string, @Request() req) {
    return this.workspacesService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Request() req) {
    return this.workspacesService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOne(@Body() dto: CreateWorkspaceDto, @Request() req) {
    return this.workspacesService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateOne(
    @Param("id") id: string,
    @Body() dto: UpdateWorkspaceDto,
    @Request() req
  ) {
    return this.workspacesService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteOne(@Param("id") id: string, @Request() req) {
    return this.workspacesService.delete(id, req.user);
  }
}
