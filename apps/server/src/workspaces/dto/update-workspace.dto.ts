import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkspaceDto } from "./create-workpsace.dto";

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
