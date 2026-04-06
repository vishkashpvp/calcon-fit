"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Plus, LogIn, Copy, Check, ChevronRight, Loader2, ArrowUpDown } from "lucide-react";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SquadItem {
  id: string;
  name: string;
  code: string;
  description: string | null;
  createdBy: string;
  maxMembers: number;
  createdAt: string;
  memberCount: number;
  role: string;
}

interface SquadsClientProps {
  squads: SquadItem[];
}

type SortKey = "recent" | "mine-first";

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        copy();
      }}
      className="bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-0.5 font-mono text-xs tabular-nums transition-colors"
    >
      {code}
      {copied ? <Check className="text-success h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export function SquadsClient({ squads }: SquadsClientProps) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "join">("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [sort, setSort] = useState<SortKey>("mine-first");

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/squads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push(`/squads/${json.data.code}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (joinCode.length !== 7) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/squads/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode.toUpperCase() }),
      });
      const json = await res.json();
      if (json.alreadyMember) {
        router.push(`/squads/${json.code}`);
        return;
      }
      if (!res.ok) throw new Error(json.error);
      router.push(`/squads/${json.data.code}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...squads].sort((a, b) => {
    if (sort === "mine-first") {
      if (a.role === "owner" && b.role !== "owner") return -1;
      if (a.role !== "owner" && b.role === "owner") return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const anim = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.3 },
  });

  if (view === "create") {
    return (
      <div className="space-y-6">
        <motion.div {...anim(0)}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setView("list");
                setError("");
              }}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              &larr; Back
            </button>
          </div>
          <h1 className="mt-2 text-2xl font-bold">Create a Squad</h1>
          <p className="text-muted-foreground text-sm">
            Your friends will join using the invite code.
          </p>
        </motion.div>
        <motion.div {...anim(0.05)}>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="squad-name">Squad Name</Label>
                <Input
                  id="squad-name"
                  placeholder="e.g. Gym Bros"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squad-desc">Description (optional)</Label>
                <Input
                  id="squad-desc"
                  placeholder="What's this squad about?"
                  maxLength={120}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button variant="glow" onClick={handleCreate} disabled={loading || !name.trim()}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Squad
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (view === "join") {
    return (
      <div className="space-y-6">
        <motion.div {...anim(0)}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setView("list");
                setError("");
              }}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              &larr; Back
            </button>
          </div>
          <h1 className="mt-2 text-2xl font-bold">Join a Squad</h1>
          <p className="text-muted-foreground text-sm">
            Enter the 7-character invite code from your friend.
          </p>
        </motion.div>
        <motion.div {...anim(0.05)}>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="join-code">Invite Code</Label>
                <Input
                  id="join-code"
                  placeholder="ABC1234"
                  maxLength={7}
                  className="font-mono tracking-widest uppercase"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                variant="glow"
                onClick={handleJoin}
                disabled={loading || joinCode.length !== 7}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Join Squad
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...anim(0)}>
        <PageModuleHeader
          category="Community"
          title="Squads"
          description="Track your friends' calories & boost motivation together"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setView("join")}>
                <LogIn className="mr-1.5 h-3.5 w-3.5" /> Join
              </Button>
              <Button variant="glow" size="sm" onClick={() => setView("create")}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Create
              </Button>
            </div>
          }
        />
      </motion.div>

      {squads.length > 1 && (
        <motion.div {...anim(0.02)} className="flex justify-end">
          <button
            onClick={() => setSort(sort === "mine-first" ? "recent" : "mine-first")}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sort === "mine-first" ? "My squads first" : "Recent first"}
          </button>
        </motion.div>
      )}

      {squads.length === 0 ? (
        <motion.div {...anim(0.05)}>
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="bg-muted flex h-12 w-12 items-center justify-center">
                <Users className="text-muted-foreground h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">No squads yet</p>
                <p className="text-muted-foreground text-sm">
                  Create one or join with a friend&apos;s invite code.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((squad, i) => {
            const isOwned = squad.role === "owner";
            return (
              <motion.div key={squad.id} {...anim(0.03 * (i + 1))}>
                <Link href={`/squads/${squad.code}`}>
                  <Card
                    className={`hover:bg-muted/30 h-full transition-colors ${
                      isOwned ? "border-accent-violet/40" : ""
                    }`}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <span className="shrink-0 text-2xl leading-none">👥</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{squad.name}</p>
                          <span
                            className={`shrink-0 px-2 py-0.5 text-[10px] leading-none font-semibold ${
                              isOwned
                                ? "bg-accent-violet/15 text-accent-violet"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isOwned ? "Owner" : "Member"}
                          </span>
                        </div>
                        {squad.description && (
                          <p className="text-muted-foreground mt-0.5 truncate text-xs">
                            {squad.description}
                          </p>
                        )}
                        <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                          <span>
                            {squad.memberCount}/{squad.maxMembers} members
                          </span>
                          <CopyCode code={squad.code} />
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
