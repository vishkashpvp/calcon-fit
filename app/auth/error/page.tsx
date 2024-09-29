"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowRight from "@icons/ArrowRight";
import Button from "@ui/Button";

interface ErrorMessageProps {
  router: ReturnType<typeof useRouter>;
}

export default function AuthError() {
  const router = useRouter();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorMessageContent router={router} />
    </Suspense>
  );
}

function ErrorMessageContent({ router }: ErrorMessageProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const provider = searchParams.get("provider");
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-svh">
      <h1 className="text-3xl font-bold text-red-500">Sign In Error</h1>
      {getErrorMessage(error, provider)}
      <Button
        text="Back to login"
        onClick={() => router.push("/api/auth/signin")}
        icon={<ArrowRight />}
        iconAlign="end"
      />
    </div>
  );
}

function getErrorMessage(error: string | null, provider: string | null) {
  if (error === "provider") {
    return (
      <div className="text-xl">
        An account already exists with this email, registered using{" "}
        <span className="capitalize">{provider}</span> <br />
        Please sign in with that provider.
      </div>
    );
  } else if (error === "unknown") {
    return <div>An unknown error occurred. Please try again later.</div>;
  }
  return <div>Something went wrong!</div>;
}
