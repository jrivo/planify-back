import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
  Res,
  Put,
  Req,
  UseInterceptors,
  UploadedFiles,
  Query,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { Self } from "src/auth/self.decorator";
import { SelfGuard } from "src/auth/self.guard";
import { CdnService } from "src/cdn/cdn.service";
import { GetUsersParamsDto, updateUserDto } from "./user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private userService: UsersService,
    private cdnService: CdnService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MODERATOR")
  async getAll(@Res() res,@Query() queries:GetUsersParamsDto) {
    this.userService
      .getAll(queries)
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((err) => {
        res.status(500).send;
      });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN","MODERATOR")
  getById(@Param("id") id: string, @Res() res) {
    this.userService
      .findById(id)
      .then((user) => {
        user
          ? res.status(200).send(user)
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @Self({ userIdParam: "id", allowAdmins: true })
  @UseInterceptors(AnyFilesInterceptor())
  async updateUser(
    @Param("id") id: string,
    @Req() req: any,
    @Body() body: updateUserDto,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
    this.userService
      .update(id, req, body)
      .then((user) => {
        user
          ? res.status(200).send(user)
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send;
      });
  }
}
