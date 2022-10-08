import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JWT, JWT_SECRET_KEY } from "src/constants";
import { User } from "@prisma/client";
import { PrismaService } from "src/globals/prisma/prisma.service";

export interface Payload {
  email: string;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(JWT_SECRET_KEY),
      ignoreExpiration: false,
    });
  }

  async validate(
    payload: Payload & {
      iat: number;
      exp: number;
    }
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest as User;
    }
    return null;
  }
}
