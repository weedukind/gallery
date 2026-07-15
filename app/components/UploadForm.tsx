"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {

    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setSelectedFiles(Array.from(e.target.files));
    }

    async function upload() {

        if (selectedFiles.length === 0)
            return;

        setUploading(true);

        const form = new FormData();

        for (const file of selectedFiles) {
            form.append("files", file);
        }

        const res = await fetch("/api/upload", {
            method: "POST",
            body: form
        });

        if (!res.ok) {
            alert("Upload fehlgeschlagen.");
            setUploading(false);
            return;
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

            )}

        </div>
    );
}