import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing"

import { AuthService } from "./auth.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";


describe('UserController', () => {

let controller: UserController;
  let fakeUsersService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) => {
        return Promise.resolve({
                id,
                email: 'asdf@asdf.com',
                password: 'asdf',
            } as unknown as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        
      ],
    }).compile();

    controller = module.get(UserController);
  });

    it('can create an instance of auth service', async () => {
        expect(controller).toBeDefined();
      });

    it('findAllUsers method return a list of users with given email', async() => {
        const users = await controller.findAllUsers("asdf@asdf.com");
        expect(users).toBeDefined();
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual("asdf@asdf.com")
    })

    it("return the current user after sign in", async () => {
        const session = { userId: 100}
        const user = await controller.signin({email: "1@1.com", password: "1"}, session);
        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1)
    })

    it("findUser return a given user by id", async () => {
        const user = await controller.findUser("1")
        expect(user.email).toEqual("asdf@asdf.com");
    })

    it("throws error if current user is not found by id", async () => {
        fakeUsersService.findOne = () => null; 
        await expect(controller.findUser("1 ")).rejects.toThrow(
            NotFoundException
        )
        
    })
})