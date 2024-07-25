export class UnauthenticationError extends Error {
  constructor() {
    super("You must be logged in to view this content.");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super("Email is already in use");
    this.name = "EmailInUseError";
  }
}
