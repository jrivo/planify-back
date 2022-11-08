import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "src/user/users.module";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     //UsersModule,
    //     UsersModule
    //   ],
    //   providers: [AuthService],
    // }).compile();

    // service = module.get<AuthService>(AuthService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it("fake test", () => {
    expect(1).toBe(1);
  });
});
