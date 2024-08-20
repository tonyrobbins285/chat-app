import "server-only";

import { ClientError } from "@/lib/errors";
import { isRedirectError } from "next/dist/client/components/redirect";

type AsyncActionFunction<T> = (inputs: T) => Promise<void>;

type ActionResult =
  | {
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
  <T>(fn: AsyncActionFunction<T>, errorFile: string) =>
  async (inputs: T): Promise<ActionResult> => {
    try {
      await fn(inputs);

      return {
        success: true,
      };
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      let message = "Internal Error. Please try again!";
      let name = "InternalError";

      if (error instanceof ClientError) {
        message = error.message;
        name = error.name;
      } else {
        console.error(`Error in file '${errorFile}':`, error);
      }

      return {
        error: {
          message,
          name,
        },
        success: false,
      };
    }
  };
