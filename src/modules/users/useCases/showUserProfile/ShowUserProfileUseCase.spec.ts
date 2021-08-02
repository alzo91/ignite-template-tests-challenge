import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userInMemoryRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    userInMemoryRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userInMemoryRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await userInMemoryRepository.create({
      name: "test",
      email: "test@testapp.com",
      password: "123456",
    });
    const user_profile = await showUserProfileUseCase.execute(user.id);
    expect(user_profile).toBeInstanceOf(User);
  });

  it("should not be able to show user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user.id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
