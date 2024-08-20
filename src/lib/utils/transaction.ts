import "server-only";

import { prisma } from "@/lib/prisma";
import { JsPromise } from "@prisma/client/runtime/library";

type PrismaClientType = typeof prisma;

export type TransactionType = Omit<
  PrismaClientType,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export const createTransaction = async (
  cb: (tx: TransactionType) => JsPromise<unknown>,
) => {
  await prisma.$transaction(cb);
};
