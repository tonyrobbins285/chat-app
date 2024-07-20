import { useFormContext } from "react-hook-form";
import { Check, CircleAlert, X } from "lucide-react";

export default function FormPasswordRequirementIndicator({
  regexObj,
}: {
  regexObj: {
    regex: RegExp;
    message: string;
  };
}) {
  const { getValues, getFieldState } = useFormContext();
  const { isTouched } = getFieldState("password");
  const isValid = regexObj.regex?.test(getValues("password"));

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="basis-[13px]">
        {isValid && <Check size={13} className="text-emerald-900" />}
        {!isValid && isTouched && <X size={13} className="text-destructive" />}
        {!isValid && !isTouched && <CircleAlert size={13} />}
      </div>

      <p
        className={
          isValid ? "text-emerald-900" : isTouched ? "text-destructive" : ""
        }
      >
        {regexObj.message}
      </p>
    </div>
  );
}
