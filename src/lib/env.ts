const validateEnv = (name: string, value: string | undefined) => {
  if (!value) {
    console.error(`Missing environment variable: ${name}`);
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const env = {
  GITHUB_ID: validateEnv("GITHUB_ID", process.env.GITHUB_ID),
  GITHUB_SECRET: validateEnv("GITHUB_SECRET", process.env.GITHUB_SECRET),
  EMAIL_HOST: validateEnv("EMAIL_HOST", process.env.EMAIL_HOST),
  EMAIL_PORT: Number(validateEnv("EMAIL_PORT", process.env.EMAIL_PORT)),
  EMAIL_USERNAME: validateEnv("EMAIL_USERNAME", process.env.EMAIL_USERNAME),
  EMAIL_PASSWORD: validateEnv("EMAIL_PASSWORD", process.env.EMAIL_PASSWORD),
  EMAIL_FROM: validateEnv("EMAIL_FROM", process.env.EMAIL_FROM),
  ACCESS_TOKEN_SECRET: validateEnv(
    "ACCESS_TOKEN_SECRET",
    process.env.ACCESS_TOKEN_SECRET,
  ),
  REFRESH_TOKEN_SECRET: validateEnv(
    "REFRESH_TOKEN_SECRET",
    process.env.REFRESH_TOKEN_SECRET,
  ),
  VERIFICATION_TOKEN_SECRET: validateEnv(
    "VERIFICATION_TOKEN_SECRET",
    process.env.VERIFICATION_TOKEN_SECRET,
  ),
  RESET_TOKEN_SECRET: validateEnv(
    "RESET_TOKEN_SECRET",
    process.env.RESET_TOKEN_SECRET,
  ),
};
