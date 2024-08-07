export class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends ClientError {
  constructor() {
    super("You must be logged in to view this content.");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends ClientError {
  constructor() {
    super("Email is already in use.");
    this.name = "EmailInUseError";
  }
}

export class InputValidationError extends ClientError {
  constructor() {
    super("Invalid Inputs.");
    this.name = "InputValidationError";
  }
}

export class SendEmailError extends ClientError {
  constructor() {
    super("Error: Could not send email.");
    this.name = "SendEmailError";
  }
}

export class UserDoesNotExistError extends ClientError {
  constructor() {
    super("Error: User does not exist.");
    this.name = "UserDoesNotExistError";
  }
}
