import { prisma } from "@/lib/prisma";
import { JsPromise } from "@prisma/client/runtime/library";

type PrismaClientType = typeof prisma;

export type TransactionType = Omit<
  PrismaClientType,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function createTransaction(
  cb: (tx: TransactionType) => JsPromise<unknown>,
) {
  await prisma.$transaction(cb);
}
