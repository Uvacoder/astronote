import { IsOptional, IsString } from "class-validator";

export class CreateNotebookDto {
  @IsString()
  workspaceId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string | null;

  @IsOptional()
  @IsString()
  emoji?: string | null;
}
