import { PublicError } from "./errors";

type AsyncActionFunction<T> = (
  inputs: T,
) => Promise<Record<string, string | boolean>>;

export const handleAsyncAction =
  <T>(fn: AsyncActionFunction<T>, errorFile?: string) =>
  async (inputs: T) => {
    try {
      await fn(inputs);
    } catch (error) {
      const errorObj = {
        success: false,
        message: "",
        name: "",
      };

      if (error instanceof PublicError) {
        errorObj.message = error.message;
        errorObj.name = error.name;
      } else {
        console.error(errorFile || error);
        errorObj.message = "Internal Error.";
        errorObj.name = "InternalError";
      }

      return errorObj;
    }
  };
