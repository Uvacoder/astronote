import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;
}
