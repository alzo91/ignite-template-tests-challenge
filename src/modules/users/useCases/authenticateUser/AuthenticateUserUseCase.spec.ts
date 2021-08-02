import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersInMemoryRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersInMemoryRepository
    );
  });

  it("should be able to create new token to user", async () => {
    const password = await hash("123456", 8);
    const user = await usersInMemoryRepository.create({
      name: "Test app",
      email: "test@testapp.com",
      password,
    });

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: "123456",
    });

    expect(auth).toHaveProperty("token");
  });

  it("should not be able to create new token if password doesn't match", async () => {
    expect(async () => {
      const password = await hash("123456", 8);
      const user = await usersInMemoryRepository.create({
        name: "Test app",
        email: "test@testapp.com",
        password,
      });
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234562",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to create new token if user doesn't exist", async () => {
    expect(async () => {
      const password = await hash("123456", 8);
      const user = await usersInMemoryRepository.create({
        name: "Test app",
        email: "test@testapp.com",
        password,
      });
      await authenticateUserUseCase.execute({
        email: "test2@testapp.com",
        password: "1234562",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
