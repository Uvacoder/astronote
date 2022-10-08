import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
