export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content.");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use.");
    this.name = "EmailInUseError";
  }
}

export class InputValidationError extends PublicError {
  constructor() {
    super("Invalid Credentials.");
    this.name = "InputValidationError";
  }
}

export class SendEmailError extends PublicError {
  constructor() {
    super("Error: Could not send email.");
    this.name = "SendEmailError";
  }
}
