import React, { forwardRef } from "react";
import { Description, Field, Input as HeadlessInput, Label } from "@headlessui/react";

type InputProps = {
  label: string;
  description?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, ...rest }, ref) => {
    return (
      <div className="w-full">
        <Field>
          <Label className="font-medium text-sm/6">{label}</Label>
          {description && (
            <Description className="text-black/50 text-sm/6 dark:text-white/50">
              {description}
            </Description>
          )}
          <HeadlessInput
            ref={ref}
            {...rest}
            className={`mt-1 block w-full rounded-lg border-none bg-black/10 py-1.5 px-3 text-sm/6 text-black
            focus:outline-none focus:ring-2 ring-1 ring-black/50 dark:ring-white/50 focus:ring-black/50
            dark:bg-white/10 dark:text-white dark:focus:ring-white/25`}
          />
          {error && <div className="text-sm text-red-500 ms-1">{error}</div>}
        </Field>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
