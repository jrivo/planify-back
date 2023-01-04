import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "src/user/users.module";
import { UsersService } from "src/user/users.service";
import { AuthService } from "./auth.service";
import * as bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "src/const";

jest.mock("bcrypt", () => {
  return {
    hashSync: jest.fn(),
    compare: jest.fn(),
  };
});

// jest.mock('@prisma/client', () => {
//   return {
//     prisma: {
//       address: {
//         create: jest.fn(),
//       },
//       user: {
//         create: jest.fn(),
//         findUnique: jest.fn(),
//       },
//       media: {
//         create: jest.fn(),
//       },
//     },
//   };
// });

// const prisma = require('@prisma/client').prisma;



describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // it("should return null if no user is found", async () => {
  //   const authService = new AuthService(new UsersService(), new JwtService());
  //   const result = await authService.validateUser(
  //     "invalid@email.com",
  //     "password"
  //   );
  //   expect(result).toBeNull();
  // });

  // it("should return null if the provided password is incorrect", async () => {
  //   const authService = new AuthService(new UsersService(), new JwtService());
  //   const user = {
  //     id: 1,
  //     email: "user@email.com",
  //     password: bcrypt.hashSync("password", BCRYPT_SALT_ROUNDS),
  //     firstName: "John",
  //     lastName: "Doe",
  //   };
  //   jest.spyOn(usersService, "findByEmail").mockResolvedValue(user);
  //   const result = await authService.validateUser(
  //     "user@email.com",
  //     "wrongpassword"
  //   );
  //   expect(result).toBeNull();
  // });

  // it("should test the login function", async () => {
  //   const validateUser = jest.fn().mockResolvedValue({
  //     id: 1,
  //     email: "user@example.com",
  //     role: "admin",
  //   });

  //   //mock jwt sign
  //   jwt.sign.mockReturnValue("my-access-token");

  //   // Call the login function
  //   const result = await service.login("user@example.com", "password");

  //   expect(validateUser).toHaveBeenCalledWith("user@example.com", "password");
  //   expect(jwt.sign).toHaveBeenCalledWith(
  //     { sub: 1, email: "user@example.com" },
  //     { secret: "my-secret" }
  //   );
  //   expect(result).toEqual({
  //     id: 1,
  //     email: "user@example.com",
  //     role: "admin",
  //     access_token: "my-access-token",
  //   });
  // });

  it('getUser testing', async () => {
    const findById = jest.fn().mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed password',
    });
    usersService.findById = findById;

    // Call the getUser function
    const result = await service.getUser('1');

    expect(findById).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      id: 1,
      email: 'user@example.com',
    });
  });

  // it('should test the register function', async () => {
  //   const findByEmail = jest.fn().mockResolvedValue(null);
  //   usersService.findByEmail = findByEmail;

  //   bcrypt.hashSync.mockReturnValue('hashed password');

  //   jwt.sign.mockReturnValue('my-access-token');

  //   const addressCreate = jest.fn().mockResolvedValue({
  //     id: 1,
  //     street: 'Main St',
  //     streetNumber: '123',
  //     city: 'New York',
  //     postalCode: '10001',
  //     country: 'USA',
  //     region: 'NY',
  //   });
  //   prisma.address.create = addressCreate;

  //   const userCreate = jest.fn().mockResolvedValue({
  //     id: 1,
  //     email: 'user@example.com',
  //     password: 'hashed password',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     verificationToken: 'my-verification-token',
  //     address: {
  //       id: 1,
  //     email: 'user@example.com',
  //     password: 'hashed password',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     verificationToken: 'my-verification-token',
  //     address: {
  //       id: 1,
  //       street: 'Main St',
  //       streetNumber: '123',
  //       city: 'New York',
  //       postalCode: '10001',
  //       country: 'USA',
  //       region: 'NY',
  //     },
  //     profilePicture: {
  //       id: 1,
  //       name: 'profile-picture.jpg',
  //       url: 'https://cdn.example.com/profile-picture.jpg',
  //       type: 'IMAGE',
  //     },
  //   }});
  //   prisma.user.create = userCreate;

  //   const mediaCreate = jest.fn();
  //   prisma.media.create = mediaCreate;

  //   const req = {
  //     files: [
  //       {
  //         originalname: 'profile-picture.jpg',
  //         uploadName: 'profile-picture-123.jpg',
  //       },
  //     ],
  //   };
  //   const body = {
  //     email: 'user@example.com',
  //     password: 'password',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     street: 'Main St',
  //     streetNumber: '123',
  //     city: 'New York',
  //     postalCode: '10001',
  //     country: 'USA',
  //     region: 'NY',
  //     phoneNumber: '123-456-7890',
  //     role: 'ADMIN',
  //   };

  //   // Call the register function
  //   const result = await service.register(req, body);

  //   expect(findByEmail).toHaveBeenCalledWith('user@example.com');
  //   expect(bcrypt.hashSync).toHaveBeenCalledWith('password', BCRYPT_SALT_ROUNDS);
  //   expect(addressCreate).toHaveBeenCalledWith({
  //     data: {
  //       street: 'Main St',
  //       streetNumber: '123',
  //       city: 'New York',
  //       postalCode: '10001',
  //       country: 'USA',
  //             region: 'NY',
  //     }
  //   });
  //   expect(userCreate).toHaveBeenCalledWith({
  //     data: {
  //       email: 'user@example.com',
  //       password: 'hashed password',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       verificationToken: 'my-verification-token',
  //       address: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //       phone: '123-456-7890',
  //       role: 'ADMIN',
  //     },
  //     include: {
  //       profilePicture: true,
  //       address: true,
  //     },
  //   });
  //   expect(mediaCreate).toHaveBeenCalledWith({
  //     data: {
  //       name: 'profile-picture.jpg',
  //       url: 'https://cdn.example.com/profile-picture.jpg',
  //       type: 'IMAGE',
  //       user: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //     },
  //   });
  //   expect(sendVerificationEmail).toHaveBeenCalledWith('user@example.com', 'my-verification-token');
  //   expect(jwt.sign).toHaveBeenCalledWith({ sub: 1, email: 'user@example.com' }, { secret: jwtConstants.secret,
  //   });
  //   expect(result).toEqual({
  //     id: 1,
  //     email: 'user@example.com',
  //     access_token: 'my-access-token',
  //   });
  // });

  // it('should reset the password and send an email', async () => {
  //   const findUnique = jest.fn().mockResolvedValue({
  //     id: 1,
  //     email: 'user@example.com',
  //     password: 'old password',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     verificationToken: 'my-verification-token',
  //     address: {
  //       id: 1,
  //       street: 'Main St',
  //       streetNumber: '123',
  //       city: 'New York',
  //       postalCode: '10001',
  //       country: 'USA',
  //       region: 'NY',
  //     },
  //     profilePicture: {
  //       id: 1,
  //       name: 'profile-picture.jpg',
  //       url: 'https://cdn.example.com/profile-picture.jpg',
  //       type: 'IMAGE',
  //     },
  //   });
  //   prisma.user.findUnique = findUnique;

  //   const update = jest.fn().mockResolvedValue({});
  //   prisma.user.update = update;

  //   const sendResetPasswordEmail = jest.fn();

  //   const body = {
  //     email: 'user@example.com',
  //   };
  //   const result = await service.forgotPassword(body);

  //   expect(findUnique).toHaveBeenCalledWith({
  //     where: {
  //       email: 'user@example.com',
  //     },
  //   });
  //   expect(update).toHaveBeenCalledWith({
  //     where: {
  //       id: 1,
  //     },
  //     data: {
  //       password: 'hashed password',
  //     },
  //   });
  //   expect(sendResetPasswordEmail).toHaveBeenCalledWith('user@example.com', 'my-new-password');
  //   expect(result).toBe(true);
  // });
});
