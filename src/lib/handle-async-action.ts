import "server-only";

import { ClientError } from "./errors";
import { isRedirectError } from "next/dist/client/components/redirect";

type AsyncActionFunction<T> = (inputs: T) => Promise<Record<string, string>>;

type HandleAsyncActionType =
  | {
      data?: Record<string, string>;
      success: true;
    }
  | {
      error: {
        message: string;
        name: string;
      };
      success: false;
    };

export const handleAsyncAction =
  <T>(fn: AsyncActionFunction<T>, errorFile?: string) =>
  async (inputs: T): Promise<HandleAsyncActionType> => {
    try {
      const result = await fn(inputs);

      return {
        data: result,
        success: true,
      };
    } catch (error) {
      const errorObj = {
        error: {
          message: "",
          name: "",
        },
        success: false,
      };
      if (isRedirectError(error)) {
        throw error;
      }

      if (error instanceof ClientError) {
        errorObj.error.message = error.message;
        errorObj.error.name = error.name;
      } else {
        console.error("Error: ", errorFile || error);
        errorObj.error.message = "Internal Error.";
        errorObj.error.name = "InternalError";
      }
      return errorObj;
    }
  };
