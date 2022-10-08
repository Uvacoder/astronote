import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LogInDto, SignUpDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  logIn(@Body() dto: LogInDto) {
    return this.authService.logIn(dto);
  }

  @Post("signup")
  signup(@Body() dto: SignUpDto) {
    return this.authService.singUp(dto);
  }
}
