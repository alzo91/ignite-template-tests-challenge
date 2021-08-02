import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersInMemoryRepository: InMemoryUsersRepository;
let statementsInMemoryRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get statement operation detail", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    statementsInMemoryRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
  });

  // throw new GetStatementOperationError.UserNotFound();
  it("should not be able to get operation if user doesn't exist", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "000",
        statement_id: "0000",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get operation if statement doesn't exist", async () => {
    expect(async () => {
      const user = await usersInMemoryRepository.create({
        name: "test app",
        password: "01234",
        email: "test@testapp.com",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "0000",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be get statement operantion by statement.id", async () => {
    const user = await usersInMemoryRepository.create({
      name: "test app",
      password: "01234",
      email: "test@testapp.com",
    });

    const operation = await statementsInMemoryRepository.create({
      amount: 100,
      user_id: user.id,
      type: OperationType.DEPOSIT,
      description: "deposit",
    });

    const operantion = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: operation.id,
    });

    expect(operantion).toHaveProperty("id");
    expect(operantion.amount).toBe(operantion.amount);
  });
});
