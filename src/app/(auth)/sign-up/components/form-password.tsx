import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  mixedCaseLettersRegex,
  minEightCharactersRegex,
  oneDigitRegex,
} from "@/regex/password";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import FormPasswordRequirementIndicator from "./form-password-requirement-indicator";

export default function FormPassword() {
  const form = useFormContext();
  const [isShown, setIsShown] = useState(false);

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <div className="space-y-5">
          <FormItem>
            <FormLabel className="text-sm text-primary">Password</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type={isShown ? "text" : "password"}
                  className={cn(
                    "text-md pr-8 tracking-widest transition-all focus-visible:ring-blue-500 focus-visible:ring-offset-0",
                    form.formState.errors?.password &&
                      "ring-2 ring-red-500 focus-visible:ring-red-500",
                  )}
                  {...field}
                />
              </FormControl>
              <div
                onClick={() => {
                  setIsShown(!isShown);
                }}
                className="absolute right-3 top-[50%] translate-y-[-50%] text-muted-foreground hover:scale-110 hover:cursor-pointer hover:text-foreground"
              >
                {!isShown ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            <FormMessage className="text-xs" />
          </FormItem>

          <div className="space-y-2 text-xs text-primary">
            <p className="font-semibold">Create a password that:</p>
            <FormPasswordRequirementIndicator
              regexObj={minEightCharactersRegex}
            />
            <FormPasswordRequirementIndicator
              regexObj={mixedCaseLettersRegex}
            />
            <FormPasswordRequirementIndicator regexObj={oneDigitRegex} />
          </div>
        </div>
      )}
    />
  );
}
