import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { user_id: sender_id } = request.params;

    const { amount, description } = request.body;

    const transferStatementUseCase = container.resolve(
      TransferStatementUseCase
    );

    const answer = await transferStatementUseCase.execute({
      user_id,
      sender_id,
      amount,
      description,
    });

    return response.status(200).json(answer);
  }
}

export { TransferStatementController };
