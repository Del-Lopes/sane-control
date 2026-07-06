"use client";

import { useTransition } from "react";
import { setPostStatus, deletePost } from "@/server/ai-publish.actions";

export default function PostActions({
  postId,
  status,
}: {
  postId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const isPublished = status === "published";

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setPostStatus(postId, isPublished ? "draft" : "published");
          })
        }
        className="rounded-lg border border-black/10 px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
      >
        {isPublished ? "Despublicar" : "Publicar"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (!confirm("Excluir este post permanentemente?")) return;
          startTransition(async () => {
            await deletePost(postId);
          });
        }}
        className="rounded-lg border border-black/10 px-3 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}
