"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/config/messages";

export default function AuthErrorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="bg-destructive/10 mb-8 flex h-16 w-16 items-center justify-center">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>

      <div className="border-border/40 bg-card/60 w-full border p-8 text-center backdrop-blur-xl sm:p-10">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Authentication Error</h1>
        <p className="text-muted-foreground mt-3 text-sm">{MESSAGES.AUTH.UNKNOWN_ERROR}</p>

        <div className="mt-8">
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:border-foreground/30 hover:bg-foreground/5 h-12 w-full text-sm font-medium transition-all"
            >
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
