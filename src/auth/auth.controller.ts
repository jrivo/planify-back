import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFiles,
  Res,
  Param,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CdnService } from "src/cdn/cdn.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private cdnService: CdnService
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post("register")
  @UseInterceptors(AnyFilesInterceptor())
  async register(
    @Body() body: RegisterDto,
    @Request() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
    return this.authService.register(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@Request() req, @Res() res) {
    if(!req.user) return res.status(401).send("Unauthorized")
    this.authService.getUser(req.user.id).then((user) => {
      user
        ? res.status(200).send(user)
        : res.status(404).send({ message: "User not found" });
    });
  }
}
