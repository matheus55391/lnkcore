"use client";

import { CurrentUser } from "@/actions/user/get-current-user";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateCheckoutSessionMutation } from "@/queries/use-create-checkout-session-mutation";
import { useCurrentUser } from "@/queries/use-current-user-query";
import { Loader2Icon, SettingsIcon, UserIcon, Zap } from "lucide-react";
import { useState } from "react";

type ProfileAvatarProps = {
    user: CurrentUser;
};

export function ProfileAvatar({ user }: ProfileAvatarProps) {
    const [error, setError] = useState<string | null>(null);
    const { data: currentUser, isLoading } = useCurrentUser();

    const mutation = useCreateCheckoutSessionMutation({
        onError: (err) => setError(err.message),
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-border bg-background"
                >
                    <Avatar>
                        <AvatarImage src={undefined} alt="" />
                        <AvatarFallback className="text-foreground">
                            {(user?.name ?? user?.email ?? "U")
                                .trim()
                                .slice(0, 1)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-0">
                <div className="px-3 py-2.5">
                    <p className="text-sm font-medium leading-none">
                        {user?.name ?? "Conta"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {user?.email ?? ""}
                    </p>
                </div>

                <DropdownMenuSeparator className="my-0" />

                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Meu Perfil
                    </DropdownMenuItem>

                    {currentUser?.plan !== "PRO" && (
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setError(null);
                                mutation.mutate();
                            }}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-4 w-4" />
                            )}
                            Upgrade
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Configurações
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                {error && (
                    <p className="px-3 pb-2 text-xs text-destructive">
                        {error}
                    </p>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuGroup className="p-1">
                    <SignOutButton />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}