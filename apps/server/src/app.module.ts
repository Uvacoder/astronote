import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { NotebooksModule } from "./notebooks/notebooks.module";
import { GlobalsModule } from "./globals/globals.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { ConfigModule } from "@nestjs/config";
import { NotesModule } from "./notes/notes.module";
import { ProfilesModule } from "./profiles/profiles.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    NotebooksModule,
    GlobalsModule,
    WorkspacesModule,
    NotesModule,
    ProfilesModule,
  ],
})
export class AppModule {}
