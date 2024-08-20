import "server-only";

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}

export class UserNotFoundError extends ServerError {
  constructor() {
    super("User not found.");
    this.name = "UserNotFoundError";
  }
}

export class AccountNotFoundError extends ServerError {
  constructor() {
    super("Account not found.");
    this.name = "AccountNotFoundError";
  }
}

export class TokenNotFoundError extends ServerError {
  constructor() {
    super("Token not found or expired.");
    this.name = "TokenNotFoundError";
  }
}

export class TransactionError extends ServerError {
  constructor(message: string = "Transaction failed.") {
    super(message);
    this.name = "TransactionError";
  }
}

export class InternalServerError extends ServerError {
  constructor(message: string = "Internal server error.") {
    super(message);
    this.name = "InternalServerError";
  }
}
