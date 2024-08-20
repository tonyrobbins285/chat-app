"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResetPasswordSchema } from "@/schemas/authSchema";
import toast from "react-hot-toast";
import { resetPasswordAction } from "@/actions/reset-password";
import FormPassword from "@/components/sign-up/form-password";
import { useSearchParams } from "next/navigation";
import { InvalidTokenError } from "@/lib/errors/client";

type FormType = {
  password: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    throw new InvalidTokenError();
  }

  const form = useForm<FormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = async (values: FormType) => {
    const result = await resetPasswordAction({
      password: values.password,
      token,
    });
    if (!result.success) {
      console.error(result.error.name);
      form.setFocus("password");
      toast.error(result.error.message);
    } else {
      toast.success(`Your password is updated.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormPassword />
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
