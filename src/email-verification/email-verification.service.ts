import { Injectable } from "@nestjs/common";
import { PrismaClient, UserStatus } from "@prisma/client";
import { generateToken } from "src/utils";
import { MailService } from "../mail/mail.service";

const prisma = new PrismaClient();

@Injectable()
export class EmailVerificationService {
  constructor(private readonly mailService: MailService) {}

  async sendVerificationEmail(email: string) {
    // Generate a verification token
    const token = generateToken();
    await prisma.user.update({
      where: { email },
      data: { verificationToken: token },
    });

    // Send the verification email
    await this.mailService.sendVerificationEmail(email, token);
  }

  async verifyEmail(token: string) {
    // Look up the token in the database or cache
    const email = (
      await prisma.user.findUnique({
        where: { verificationToken: token },
        select: { email: true },
      })
    )?.email;

    // If the token is valid, mark the email as verified
    if (email) {
      await prisma.user.update({
        where: { email },
        data: { status: UserStatus.VERIFIED, verificationToken: null },
      });
      return true;
    } else {
      return false;
    }
  }
}
