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
import { SignInType } from "@/zod/types";
import { signInAction } from "@/app/(auth)/sign-in/actions";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/use-auth-store";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("from") || "/";
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<SignInType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInType) => {
    const result = await signInAction(values);
    console.log(result);
    setSession(result.accessToken);
    router.replace(url);
    // if (result.success) {
    //   if (!result.data?.accessToken) {
    //     throw new Error("Access Token has not been returned.");
    //   }
    // } else {
    //   console.error(result.error.name);
    //   toast.error(result.error.message);
    // }
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
