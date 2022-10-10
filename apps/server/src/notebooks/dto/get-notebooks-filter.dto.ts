import { IsOptional, IsString } from "class-validator";

export class GetNotebooksFilterDto {
  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
