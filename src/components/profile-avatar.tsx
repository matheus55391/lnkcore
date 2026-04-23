import { SettingsIcon, UserIcon } from "lucide-react";

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
import { useCurrentUser } from "@/queries/use-current-user-query";
import { CurrentUser } from "@/actions/user/get-current-user";

type ProfileAvatarProps = {
    user: CurrentUser
};
export function ProfileAvatar({ user }: ProfileAvatarProps) {

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
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Configurações
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <SignOutButton />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}