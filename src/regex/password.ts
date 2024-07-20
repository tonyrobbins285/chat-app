// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
export const strongPasswordRegex = {
  regex: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/),
  message: "This is not a valid password.",
};

export const minEightCharactersRegex = {
  regex: new RegExp(/^.{8,}$/),
  message: "Contains at least 8 characters",
};
export const mixedCaseLettersRegex = {
  regex: new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).+$/),
  message: "contains both lowercase (a-z) and uppercase letters (A-Z).",
};
export const oneDigitRegex = {
  regex: new RegExp(/.*[0-9].*/),
  message: "Contains at least one number (0-9).",
};
