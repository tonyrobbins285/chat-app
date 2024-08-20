"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ForgotPasswordSchema } from "@/schemas/authSchema";
import toast from "react-hot-toast";
import { ForgotPasswordFormType } from "@/lib/types";
import { forgotPasswordAction } from "@/actions/forgot-password";

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormType) => {
    const result = await forgotPasswordAction(values);
    if (!result.success) {
      console.error(result.error.name);
      form.setFocus("email");
      toast.error(result.error.message);
    } else {
      toast.success(`Reset link was sent to ${values.email}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-bold text-primary">
                Enter your email to reset password.
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
  );
}
