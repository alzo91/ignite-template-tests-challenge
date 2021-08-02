import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userInMemoryRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {
  beforeEach(() => {
    userInMemoryRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test app",
      email: "test@testapp.com",
      password: "123456",
    });

    expect(user).toBeInstanceOf(User);
  });

  it("should not be able to create a user if same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test app",
        email: "test@testapp.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "Test app 2",
        email: "test@testapp.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
