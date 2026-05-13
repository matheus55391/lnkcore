import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePage } from "@/actions/pages/delete-page";

export function useDeletePageMutation() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: string } | string>({
        mutationFn: async (input: { id: string } | string) => {
            const values = typeof input === "string" ? { id: input } : input;
            const result = await deletePage(values);
            if (!result.success) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pages"] });
        },
    });
}