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
import { SignUpSchema } from "@/zod/schema";
import { cn } from "@/lib/utils";
import FormPassword from "./form-password";
import { AuthFormType } from "@/zod/types";
import { signUpAction } from "../sign-up/actions";

export type AuthFormProps = {
  variant: "SignIn" | "SignUp";
};

export default function AuthForm({ variant }: AuthFormProps) {
  const form = useForm<AuthFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AuthFormType) => {
    if (variant === "SignIn") {
    }
    const res = await signUpAction(values);
    console.log(res);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-primary">
                Email address
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
        <FormPassword variant={variant} />
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
