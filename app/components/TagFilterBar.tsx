"use client";

import { TagRecord } from "@/types/tag";

interface Props {
    allTags: TagRecord[];
    activeTagIds: number[];
    onToggle: (tagId: number) => void;
    onReset: () => void;
}

export default function TagFilterBar({ allTags, activeTagIds, onToggle, onReset }: Props) {

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">

            <span className="text-sm text-gray-600">
                Nach Tags filtern:
            </span>

            {allTags.map(tag => {

                const active = activeTagIds.includes(tag.id!);

                return (
                    <button
                        key={tag.id}
                        onClick={() => onToggle(tag.id!)}
                        className="rounded px-2 py-0.5 text-xs"
                        style={{
                            backgroundColor: active ? tag.color : "transparent",
                            color: active ? "white" : tag.color,
                            border: `1px solid ${tag.color}`
                        }}
                    >
                        {tag.name}
                    </button>
                );
            })}

            {activeTagIds.length > 0 && (
                <button
                    onClick={onReset}
                    className="text-xs text-gray-500 underline"
                >
                    Filter zurücksetzen
                </button>
            )}

        </div>
    );
}
