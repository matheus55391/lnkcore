"use client";

import { ExternalLinkIcon, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";

import { Page } from "@/@types";
import { useState } from "react";
import { useDeletePageMutation } from "@/queries/use-delete-page-mutation";

type PageCardProps = {
    page: Page & { linksCount?: number };
};

export function PageCard({ page }: PageCardProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const deleteMutation = useDeletePageMutation();
    const router = useRouter();

    function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        deleteMutation.mutate({ id: page.id }, {
            onSuccess: () => setIsDeleteAlertOpen(false),
        });
    }

    async function handleShare() {
        const url = `${window.location.origin}/${page.slug}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: page.title, url });
                return;
            } catch {
                // usuário pode cancelar o share; cai no fallback abaixo se necessário
            }
        }

        await navigator.clipboard.writeText(url);
    }
    return (
        <Card className="hover:border-primary/50 transition cursor-pointer">
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="truncate">{page.title}</CardTitle>
                    <CardDescription className="truncate">
                        makebio.app/{page.slug}
                    </CardDescription>
                </div>

                {/* MENU 3 PONTINHOS */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/dashboard/${page.id}`);
                            }}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.preventDefault();
                                void handleShare();
                            }}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                        </DropdownMenuItem>

                        {/* DELETE COM ALERT */}
                        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsDeleteAlertOpen(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Tem certeza que deseja excluir?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso vai apagar permanentemente
                                        a página <strong>{page.title}</strong>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteAlertOpen(false);
                                        }}
                                    >
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardFooter className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                    {(page.links?.length ?? page.linksCount ?? 0)} link
                    {(page.links?.length ?? page.linksCount ?? 0) !== 1 ? "s" : ""}
                </span>

                <Button asChild variant="outline" size="sm">
                    <span>
                        <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
                        Abrir
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}