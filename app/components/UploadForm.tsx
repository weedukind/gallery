"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagRecord } from "@/types/tag";
import { assignTag, uploadFiles } from "@/lib/api";
import TagPicker from "./TagPicker";

interface Props {
    allTags: TagRecord[];
}

export default function UploadForm({ allTags }: Props) {

    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [showTagPicker, setShowTagPicker] = useState(false);

    function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setSelectedFiles(Array.from(e.target.files));
    }

    function saveTagSelection(tagIds: number[]) {
        setSelectedTagIds(tagIds);
        setShowTagPicker(false);
    }

    async function upload() {

        if (selectedFiles.length === 0)
            return;

        setUploading(true);

        let uploaded;

        try {
            uploaded = await uploadFiles(selectedFiles);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
            setUploading(false);
            return;
        }

        if (selectedTagIds.length > 0) {
            await Promise.all(
                uploaded.flatMap(file =>
                    selectedTagIds.map(tagId => assignTag(file.id, tagId))
                )
            );
        }

        router.push("/");
    }

    return (
        <div className="space-y-6">

            <input
                type="file"
                multiple
                onChange={onSelectFiles}
            />

            {selectedFiles.length > 0 && (

                <div>

                    <h2 className="font-semibold mb-2">
                        Ausgewählte Dateien
                    </h2>

                    <ul className="list-disc ml-6">

                        {selectedFiles.map(file => (
                            <li key={file.name}>
                                {file.name}
                            </li>
                        ))}

                    </ul>

                    <div className="relative mt-4 inline-block">

                        <button
                            onClick={() => setShowTagPicker(current => !current)}
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                        >
                            {selectedTagIds.length > 0
                                ? `Tags (${selectedTagIds.length})`
                                : "Tags auswählen"}
                        </button>

                        {showTagPicker && (
                            <TagPicker
                                currentTagIds={selectedTagIds}
                                allTags={allTags}
                                onSave={saveTagSelection}
                            />
                        )}

                    </div>

                    <div>
                        <button
                            onClick={upload}
                            disabled={uploading}
                            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading
                                ? "Upload läuft..."
                                : "Zu Cloudflare hochladen"}
                        </button>
                    </div>

                </div>

            )}

        </div>
    );
}
