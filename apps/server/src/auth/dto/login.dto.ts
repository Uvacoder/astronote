import { IsEmail, IsNotEmpty } from "class-validator";

export class LogInDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
