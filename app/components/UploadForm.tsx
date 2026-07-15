"use client";

import { useState } from "react";
import { UploadResult } from "@/types/upload";


export default function UploadForm() {

    const [files, setFiles] = useState<UploadResult[]>([]);
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

        const data = await res.json();

        setFiles(data);
        setSelectedFiles([]);
        setUploading(false);
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

            {files.length > 0 && (

                <table className="min-w-full border border-gray-300">

                    <thead className="bg-gray-100">

                    <tr>
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">URL</th>
                    </tr>

                    </thead>

                    <tbody>

                    {files.map((file, index) => (

                        <tr key={index}>

                            <td className="border p-2">
                                {file.name}
                            </td>

                            <td className="border p-2">

                                <a
                                    href={file.publicUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Öffnen
                                </a>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}