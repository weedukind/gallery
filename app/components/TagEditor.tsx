"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagRecord } from "@/types/tag";

interface Props {
    uploadId: number;
    tags: TagRecord[];
    allTags: TagRecord[];
}

export default function TagEditor({ uploadId, tags, allTags }: Props) {

    const router = useRouter();
    const [newTagName, setNewTagName] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [checkedTagIds, setCheckedTagIds] = useState<number[]>([]);
    const [localTags, setLocalTags] = useState<TagRecord[]>([]);

    const pickerTags = [
        ...allTags,
        ...localTags.filter(local => !allTags.some(tag => tag.id === local.id))
    ];

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

    function openPicker() {

        setCheckedTagIds(tags.map(tag => tag.id!));
        setShowPicker(true);
    }

    function toggleTag(tagId: number) {

        setCheckedTagIds(current =>
            current.includes(tagId)
                ? current.filter(id => id !== tagId)
                : [...current, tagId]
        );
    }

    async function savePicker() {

        const assignedTagIds = tags.map(tag => tag.id!);
        const toAdd = checkedTagIds.filter(tagId => !assignedTagIds.includes(tagId));
        const toRemove = assignedTagIds.filter(tagId => !checkedTagIds.includes(tagId));

        for (const tagId of toAdd) {
            await fetch(`/api/uploads/${uploadId}/tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tagId })
            });
        }

        for (const tagId of toRemove) {
            await fetch(`/api/uploads/${uploadId}/tags`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tagId })
            });
        }

        setShowPicker(false);
        setLocalTags([]);
        router.refresh();
    }

    async function createTag() {

        const name = newTagName.trim();

        if (!name)
            return;

        const createRes = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!createRes.ok) {
            const error = await createRes.json().catch(() => null);
            alert(error?.error ?? "Tag konnte nicht erstellt werden.");
            return;
        }

        const newTag: TagRecord = await createRes.json();

        setLocalTags(current => [...current, newTag]);
        setCheckedTagIds(current => [...current, newTag.id!]);
        setNewTagName("");
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

            <span className="relative inline-flex items-center">

                <button
                    onClick={() => showPicker ? setShowPicker(false) : openPicker()}
                    className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700"
                >
                    +
                </button>

                {showPicker && (

                    <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded border border-gray-300 bg-white p-2 shadow">

                        <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">

                            {pickerTags.map(tag => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-1 text-xs text-black"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checkedTagIds.includes(tag.id!)}
                                        onChange={() => toggleTag(tag.id!)}
                                    />
                                    {tag.name}
                                </label>
                            ))}

                        </div>

                        <div className="mt-2 flex items-center gap-1 border-t border-gray-200 pt-2">

                            <input
                                type="text"
                                value={newTagName}
                                onChange={e => setNewTagName(e.target.value)}
                                placeholder="Neues Tag…"
                                className="w-full min-w-0 rounded border border-gray-300 px-1 text-xs text-black"
                            />

                            <button
                                onClick={createTag}
                                disabled={!newTagName.trim()}
                                className="shrink-0 rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                +
                            </button>

                        </div>

                        <button
                            onClick={savePicker}
                            className="mt-2 w-full rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700"
                        >
                            Speichern
                        </button>

                    </div>

                )}

            </span>

        </div>
    );
}
