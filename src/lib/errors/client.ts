export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

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

export class InvalidTokenError extends ClientError {
  constructor() {
    super("Invalid Token.");
    this.name = "InvalidTokenError";
  }
}
