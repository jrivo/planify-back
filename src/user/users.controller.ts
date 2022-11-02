import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
  Res,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
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
}
