import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";

interface IRequest {
  amount: number;
  description: string;
  user_id: string;
  sender_id: string;
}

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute(data: IRequest): Promise<Statement> {
    const { amount, description, sender_id, user_id } = data;

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new TransferStatementError.UserNotFound();
    }

    const userSender = await this.usersRepository.findById(sender_id);

    if (!userSender) {
      throw new TransferStatementError.SenderNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
    });

    if (balance < amount) {
      throw new TransferStatementError.InsufficientFunds();
    }

    const statementTransf = await this.statementsRepository.create({
      user_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount: amount * -1,
      description,
    });

    const statementDeposit = await this.statementsRepository.create({
      user_id: sender_id,
      sender_id: user_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    return statementTransf;
  }
}

export { TransferStatementUseCase };
