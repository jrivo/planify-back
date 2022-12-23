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
  Delete,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { NotBlockedGuard } from "src/auth/notBlocked.guard";
import { Entity } from "src/auth/ownerOrAdmin.decorator";
import { OwnerOrAdminGuard } from "src/auth/ownerOrAdmin.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { SelfGuard } from "src/auth/self.guard";
import { CdnService } from "src/cdn/cdn.service";
import { changeUserRoleDto, GetUsersParamsDto, updatePasswordDto, updateUserDto, updateUserStatusDto } from "./user.dto";
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
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard,NotBlockedGuard)
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

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard,NotBlockedGuard)
  @Entity("user")
  async delete(@Param("id") id: string, @Res() res) {
    this.userService
      .delete(id)
      .then((user) => {
        user
          ? res.status(200).send(user)
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send;
      });
  }

  @Put(":id/role")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateRole(@Param("id") id:string, @Body() body: changeUserRoleDto,@Res() res) {
    this.userService
      .changeRole(id,body)
      .then((user) => {
        user
          ? res.status(200).send(user)
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send;
      });
  }

  @Put(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN","MODERATOR")
  async blockUser(@Param("id") id:string,@Body() body:updateUserStatusDto,@Res() res) {
    this.userService
      .updateStatus(id,body)
      .then((user) => {
        user
          ? res.status(200).send(user)
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send;
      });
  }

  @Put(":id/password")
  @UseGuards(JwtAuthGuard, SelfGuard,NotBlockedGuard)
  async updatePassword(@Param("id") id:string,@Body() body:updatePasswordDto,@Res() res) {
    this.userService
      .updatePassword(id,body)
      .then((user) => {
        user
          ? res.status(200).send("Password updated")
          : res.status(404).send("User not found");
      })
      .catch((err) => {
        res.status(500).send;
      });
  }

}
