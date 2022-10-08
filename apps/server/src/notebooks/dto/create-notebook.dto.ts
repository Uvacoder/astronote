import { IsOptional, IsString } from "class-validator";

export class CreateNotebookDto {
  @IsString()
  workspaceId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsOptional()
  @IsString()
  emoji?: string;
}
