import "server-only";

import { ClientError } from "../errors";
import { isRedirectError } from "next/dist/client/components/redirect";

type AsyncActionFunction<T> = (inputs: T) => Promise<Record<string, string>>;

type ActionResult =
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
  async (inputs: T): Promise<ActionResult> => {
    try {
      const result = await fn(inputs);

      return {
        data: result,
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
        console.error(error);
        console.error("Error in file: ", errorFile);
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
