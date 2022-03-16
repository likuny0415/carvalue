import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NotFoundError } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService
  let fakeUserService: Partial<UserService>

beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
        find: (email) => {
            const filterUsers = users.filter(user => user.email === email);
            return Promise.resolve(filterUsers);
        },
        create: (email: string, password: string) => {
            const user = {id: Math.floor(Math.random() * 99999), email, password} as User
            users.push(user);
          return Promise.resolve(user)
        }
            
      };
    
      const module = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UserService,
            useValue: fakeUserService,
          },
        ],
      }).compile();
    
    service = module.get(AuthService);
})

it('can create an instance of auth service', async () => {
  expect(service).toBeDefined();
});

it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup("test@test.com", "test")
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
})

// for the last version from jest, you can't use `async/await , promise and done together.
it('test signup with email in use', async () => {
    await service.signup("123@123.com", "123")
    
    await expect(service.signup("123@123.com", "123")).rejects.toThrow(
        BadRequestException
      );
})

it('throws error if signin is called with an unused email', async () => {
    await expect(service.signin("asdf@asdf.com", "asdf")).rejects.toThrow(
        NotFoundException
      );
})

it('throws error if the password is invalid', async () => {
    await service.signup("123@123.com", "123")
    await expect(service.signin("123@123.com", "123213")).rejects.toThrow(
        BadRequestException
    )
} )

it('correct signup and signin with email and password', async () => {
    await service.signup("123@123.com", "123")
    const user = service.signin("123@123.com", "123");
    expect(user).toBeDefined()
})

it('returns a user if the password is correct', async () => {
    await service.signup("session1@3.com", "123")
    const user = await service.signin("session1@3.com", "123")
    expect(user).toBeDefined()
})

})


