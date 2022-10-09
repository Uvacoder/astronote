import { ForbiddenException, Injectable } from "@nestjs/common";
import { LogInDto, SignUpDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { Payload } from "./strategies/jwt.strategy";
import * as argon from "argon2";
import { PrismaService } from "src/globals/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { ProfilesService } from "src/profiles/profiles.service";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import * as Color from "color";
import getRandomNumberBetwen from "src/utils/getRandomNumberBetwen";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly workspacesService: WorkspacesService
  ) {}

  async logIn(logInDto: LogInDto) {
    const { email, password } = logInDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException("Invalid Credentials");
    }

    const passwordMatched = await argon.verify(user.password, password);
    if (!passwordMatched) {
      throw new ForbiddenException("Invalid Credentials");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...data } = user;

    const payload: Payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: data,
      accessToken,
    };
  }

  async singUp(signUpDto: SignUpDto) {
    const { email, password, name, username } = signUpDto;

    const hashedPassword = await argon.hash(password);

    const user = await this.usersService.createUser({
      email,
      name,
      password: hashedPassword,
      username,
    });
    if (!user) {
      throw new ForbiddenException("Failed to create user");
    }

    // Creating default profile for this new user
    await this.profilesService.create({}, user);
    // Creating default workspace for this new user
    const color = Color.rgb(
      getRandomNumberBetwen(100, 160),
      getRandomNumberBetwen(100, 160),
      getRandomNumberBetwen(100, 160)
    ).hex();
    await this.workspacesService.create(
      {
        name: `${signUpDto.name}'s Workspace`,
        color,
      },
      user
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...data } = user;

    const payload: Payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: data,
      accessToken,
    };
  }
}
