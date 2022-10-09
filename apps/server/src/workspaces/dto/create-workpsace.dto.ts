import { IsHexColor, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateWorkspaceDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;

  @IsOptional()
  emoji?: string;
}
