"use client";

import { useRouter } from "next/navigation";
import { TagRecord } from "@/types/tag";

interface Props {
    uploadId: number;
    tags: TagRecord[];
}

export default function TagEditor({ uploadId, tags }: Props) {

    const router = useRouter();

    async function removeTag(tagId: number) {

        const res = await fetch(`/api/uploads/${uploadId}/tags`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tagId })
        });

        if (!res.ok) {
            alert("Tag konnte nicht entfernt werden.");
            return;
        }

        router.refresh();
    }

    return (
        <div className="flex flex-wrap items-center gap-1">

            {tags.map(tag => (

                <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                >
                    {tag.name}

                    <button
                        onClick={() => removeTag(tag.id!)}
                        className="hover:text-red-200"
                        aria-label={`Tag ${tag.name} entfernen`}
                    >
                        ×
                    </button>
                </span>

            ))}

        </div>
    );
}
