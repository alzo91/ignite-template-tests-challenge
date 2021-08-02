import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersInMemoryRepository: InMemoryUsersRepository;
let statementsInMemoryRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    statementsInMemoryRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsInMemoryRepository,
      usersInMemoryRepository
    );
  });

  it("should not be able to get balance if user doesn't exist", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "02030101" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be able to get balance that user", async () => {
    const user = await usersInMemoryRepository.create({
      email: "test@testapp.com",
      name: "Test APP",
      password: "123456",
    });

    await statementsInMemoryRepository.create({
      user_id: user.id,
      amount: 500,
      description: "more money",
      type: OperationType.DEPOSIT,
    });

    await statementsInMemoryRepository.create({
      user_id: user.id,
      amount: 100,
      description: "get money",
      type: OperationType.WITHDRAW,
    });

    await statementsInMemoryRepository.create({
      user_id: user.id,
      amount: 550,
      description: "more money",
      type: OperationType.DEPOSIT,
    });

    await statementsInMemoryRepository.create({
      user_id: user.id,
      amount: 50,
      description: "more money",
      type: OperationType.WITHDRAW,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.balance).toBe(900);
    expect(balance.statement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: OperationType.WITHDRAW || OperationType.DEPOSIT,
        }),
      ])
    );
  });
});
