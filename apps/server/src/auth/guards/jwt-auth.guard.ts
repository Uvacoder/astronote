import { AuthGuard } from "@nestjs/passport";
import { JWT } from "src/constants";

export class JwtAuthGuard extends AuthGuard(JWT) {}
