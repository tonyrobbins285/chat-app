"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VerifyEmailSchema } from "@/zod/schema";
import { cn } from "@/lib/utils";
import { VerifyEmailType } from "@/zod/types";
import toast from "react-hot-toast";
import { sendVerificationEmailAction } from "@/app/(auth)/verify-email/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserDoesNotExistError } from "@/lib/errors";

export default function VerifyFail() {
  const router = useRouter();

  const form = useForm<VerifyEmailType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    router.replace("/verify-email");
  }, []);

  const onSubmit = async (values: VerifyEmailType) => {
    const res = await sendVerificationEmailAction(values);

    if (res.success) {
      form.reset();
      toast.success(res.data?.message as string, { duration: 30000 });
    } else {
      if (res.error.name === new UserDoesNotExistError().name) {
        form.setError(
          "email",
          { message: res.error.message },
          { shouldFocus: true },
        );
      } else {
        toast.error(res.error?.message as string, { duration: 30000 });
      }
    }
  };

  return (
    <div>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
        Verify Failed
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-primary">
                  Enter your email to resend verification link.
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    className={cn(
                      "text-md tracking-widest transition-all focus-visible:ring-blue-500 focus-visible:ring-offset-0",
                      form.formState.errors?.email &&
                        "ring-2 ring-red-500 focus-visible:ring-red-500",
                    )}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (form.getFieldState("email").error) {
                        form.clearErrors("email");
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value) {
                        form.trigger("email");
                      }
                    }}
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            className="w-full bg-gradient-to-tr from-blue-400 to-blue-700 transition-colors duration-500 hover:from-blue-400 hover:to-transparent"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
