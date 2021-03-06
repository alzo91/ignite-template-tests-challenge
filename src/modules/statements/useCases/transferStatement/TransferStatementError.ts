import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class SenderNotFound extends AppError {
    constructor() {
      super("User who is sender was not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }
}
