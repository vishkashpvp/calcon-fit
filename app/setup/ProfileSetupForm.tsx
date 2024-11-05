"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@ui/Input";

const schema = Yup.object({
  currentWeight: Yup.number()
    .required("current weight is required")
    .positive("current weight must be a positive number")
    .typeError("current weight must be a valid number"),

  targetWeight: Yup.number()
    .required("target weight is required")
    .positive("target weight must be a positive number")
    .typeError("target weight must be a valid number"),

  height: Yup.number()
    .required("height is required")
    .positive("height must be a positive number")
    .typeError("height must be a valid number"),
}).required();

type SetupFormData = Yup.InferType<typeof schema>;

export default function ProfileSetupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const submitFunc = async (data: SetupFormData) => {
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const result = await res.json();
      console.log("result :>> ", result);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitFunc)}>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center justify-center gap-3 p-5 rounded ring-black/50 ring-1 md:w-96 md:max-w-96 dark:ring-white/50">
          <h1 className="mb-5 text-xl font-bold">final step to your squads & fitness</h1>
          <Input
            label="current weight"
            description="enter your current weight in kilograms."
            placeholder="e.g., 80"
            type="number"
            {...register("currentWeight")}
            error={errors.currentWeight?.message}
          />
          <Input
            label="target weight"
            description="enter your target weight in kilograms."
            placeholder="e.g., 70"
            type="number"
            {...register("targetWeight")}
            error={errors.targetWeight?.message}
          />
          <Input
            label="height"
            description="enter your height in centimeters."
            placeholder="e.g., 156"
            type="number"
            {...register("height")}
            error={errors.height?.message}
          />
          <button
            type="submit"
            className="w-full p-2 mt-5 rounded-lg ring-1 ring-black/50 dark:ring-white/50">
            submit
          </button>
        </div>
      </div>
    </form>
  );
}
