import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Monitor, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKey, useMountEffect } from "@/hooks";
import queryClient from "@/query-client";
import { passwordSchema } from "@/schemas";
import { apiClient } from "@/services/api-client.service";
import { authClient } from "@/services/auth-client.service";

interface Session {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  expiresAt: Date;
}

const parseUserAgent = (ua?: string | null) => {
  if (!ua) {
    return { browser: "Unknown", os: "Unknown", isMobile: false };
  }

  const isMobile = /mobile|android|iphone|ipad/i.test(ua);

  let browser = "Unknown";
  if (ua.includes("Firefox")) {
    browser = "Firefox";
  } else if (ua.includes("Edg/")) {
    browser = "Edge";
  } else if (ua.includes("Chrome")) {
    browser = "Chrome";
  } else if (ua.includes("Safari")) {
    browser = "Safari";
  }

  let os = "Unknown";
  if (ua.includes("Mac OS")) {
    os = "macOS";
  } else if (ua.includes("Windows")) {
    os = "Windows";
  } else if (ua.includes("Linux")) {
    os = "Linux";
  } else if (ua.includes("Android")) {
    os = "Android";
  } else if (/iPhone|iPad/.test(ua)) {
    os = "iOS";
  }

  return { browser, os, isMobile };
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SecurityTab = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(
    null,
  );
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsSessionsLoading(true);
    const { data } = await authClient.listSessions();

    if (data) {
      setSessions(data);
    }

    const { data: currentSession } = await authClient.getSession();

    if (currentSession?.session) {
      setCurrentSessionToken(currentSession.session.token);
    }

    setIsSessionsLoading(false);
  }, []);

  useMountEffect(() => {
    fetchSessions();
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(newPassword);
    if (!result.success) {
      setPasswordError(result.error.issues[0].message);
      return;
    }

    setIsPasswordPending(true);
    setPasswordError(null);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    setIsPasswordPending(false);

    if (error) {
      setPasswordError(error.message || "Failed to change password");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    toast.success("Your password has been changed.");
  };

  const handleRevokeSession = async (sessionToken: string) => {
    const isCurrentSession = sessionToken === currentSessionToken;
    setRevokingId(sessionToken);

    if (isCurrentSession) {
      await authClient.signOut();
      queryClient.setQueryData(queryKey(apiClient.users.getCurrent), null);
      await navigate({ to: "/sign-in" });
      return;
    }

    await authClient.revokeSession({ token: sessionToken });

    setSessions((prev) => prev.filter((s) => s.token !== sessionToken));
    setRevokingId(null);
    toast.success("Session revoked.");
  };

  const handleRevokeOtherSessions = async () => {
    setRevokingId("all");
    await authClient.revokeSessions();
    await fetchSessions();
    setRevokingId(null);
    toast.success("All other sessions have been revoked.");
  };

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput
                  id="currentPassword"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!currentPassword || !newPassword || isPasswordPending}
              >
                {isPasswordPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Devices where you&apos;re currently signed in.
            </CardDescription>
          </div>
          {!isSessionsLoading && otherSessions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeOtherSessions}
              disabled={revokingId === "all"}
              className="text-destructive hover:text-destructive"
            >
              {revokingId === "all" && (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              )}
              Revoke All Others
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isSessionsLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active sessions found.
            </p>
          ) : (
            <div className="flex flex-col">
              {sessions.map((session, index) => {
                const { browser, os, isMobile } = parseUserAgent(
                  session.userAgent,
                );
                const isCurrentSession = session.token === currentSessionToken;
                const Icon = isMobile ? Smartphone : Monitor;

                return (
                  <div key={session.id}>
                    {index > 0 && <Separator className="my-3" />}

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {browser} on {os}
                          </span>
                          {isCurrentSession && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {session.ipAddress && `${session.ipAddress} · `}
                          {formatDate(session.createdAt)}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevokeSession(session.token)}
                        disabled={revokingId === session.token}
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        {revokingId === session.token ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isCurrentSession ? (
                          <LogOut className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
