export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}
export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}

// Client Error
export class EmailInUseError extends ClientError {
  constructor() {
    super("Email is already in use.");
    this.name = "EmailInUseError";
  }
}

export class InvalidCredentialsError extends ClientError {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export class EmailVerificationError extends ClientError {
  constructor() {
    super("Email verification failed.");
    this.name = "EmailVerificationError";
  }
}

// Server Error
export class UserNotFoundError extends ServerError {
  constructor() {
    super("User not found.");
    this.name = "UserNotFoundError";
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
