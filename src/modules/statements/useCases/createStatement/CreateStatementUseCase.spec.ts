import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersInMemoryRepository: InMemoryUsersRepository;
let statementsInMemoryRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create new statement", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    statementsInMemoryRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
  });

  it("should not be able to create a new statement with user doesn't exist", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user.id",
        description: "Testing",
        amount: 100,
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to create a new statement with type deposit", async () => {
    const user = await usersInMemoryRepository.create({
      name: "Test 01",
      email: "test01@testapp.com",
      password: "123456",
    });
    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id,
      description: "Testing",
      amount: 100,
      type: OperationType.DEPOSIT,
    });
    expect(statementOperation).toHaveProperty("id");
  });

  it("should be able to create a new statement with type withdraw", async () => {
    const user = await usersInMemoryRepository.create({
      name: "test",
      email: "teste@test",
      password: "132456",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      description: "Testing deposit",
      amount: 1000,
      type: OperationType.DEPOSIT,
    });

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id,
      description: "Testing",
      amount: 100,
      type: OperationType.WITHDRAW,
    });

    expect(statementWithdraw).toHaveProperty("id");
    expect(statementWithdraw.type).toBe(OperationType.WITHDRAW);
  });

  it("should not be able to create a statement with type withdraw if insufficient user funds ", async () => {
    expect(async () => {
      const user = await usersInMemoryRepository.create({
        name: "test",
        email: "teste@test",
        password: "132456",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        description: "Testing deposit",
        amount: 1000,
        type: OperationType.DEPOSIT,
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        description: "Testing",
        amount: 1050,
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
