import { Controller, Get, Query, Res } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Get()
  async verifyEmail(@Query('token') token: string,@Res() res: any) {
    this.emailVerificationService.verifyEmail(token).then((result) => {
      return result ? res.status(200).send('Email verified') : res.status(400).send('Invalid token')
    })
  }
}
