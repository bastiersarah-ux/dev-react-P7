import { fetchAPI } from "@front/services/fetch-api";
import { Comment } from "@front/types/api-types";

export const createComment = async (
    projectId: string,
    taskId: string,
    content: string,
    init?: RequestInit,
): Promise<Comment | null> => {
    const res = await fetchAPI<{ comment: Comment }>(
        `/projects/${projectId}/tasks/${taskId}/comments`,
        {
            method: "POST",
            body: JSON.stringify({ content }),
            ...init,
        },
    );
    return res?.comment ?? null;
};
