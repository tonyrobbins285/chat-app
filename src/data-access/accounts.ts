import bcrypt from "bcrypt";

const x = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
};
