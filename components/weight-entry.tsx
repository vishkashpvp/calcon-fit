"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeightEntryProps {
  currentWeight: number;
  onSaved: () => void;
}

export function WeightEntry({ currentWeight, onSaved }: WeightEntryProps) {
  const [weight, setWeight] = useState(currentWeight.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const val = parseFloat(weight);
    if (!val || val < 20 || val > 500) return;
    setSaving(true);
    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: val }),
      });
      if (res.ok) {
        setWeight(val.toString());
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        step="0.1"
        min="20"
        max="500"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="h-9 w-28 text-center text-sm"
        placeholder="kg"
      />
      <Button size="sm" className="h-9 gap-1.5" onClick={handleSave} disabled={saving}>
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
        Log
      </Button>
    </div>
  );
}
