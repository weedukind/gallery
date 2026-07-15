"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {UploadRecord} from "@/types/upload";
import {TagRecord} from "@/types/tag";
import TagEditor from "./TagEditor";

interface FileTableProps {
    uploads: UploadRecord[];
    allTags: TagRecord[];
}

const MAX_DIGITS = 4;

function formatWithMaxDigits(value: number, suffix: string): string {

    let decimals = Math.max(0, MAX_DIGITS - Math.trunc(value).toString().length);
    let rounded = Number(value.toFixed(decimals));

    // rounding can carry into an extra integer digit (e.g. 999.99 -> 1000), so recheck once
    if (decimals > 0 && Math.trunc(rounded).toString().length > Math.trunc(value).toString().length) {
        decimals -= 1;
        rounded = Number(value.toFixed(decimals));
    }

    return `${rounded.toLocaleString("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })} ${suffix}`;
}

function formatSize(bytes: number): string {

    if (bytes < 1024)
        return bytes.toLocaleString("de-DE");

    const kb = bytes / 1024;

    if (kb < 1024)
        return formatWithMaxDigits(kb, "kB");

    return formatWithMaxDigits(kb / 1024, "MB");
}

export default function FileTable({uploads, allTags}: FileTableProps) {

    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [activeTagFilters, setActiveTagFilters] = useState<number[]>([]);

    const filteredUploads = activeTagFilters.length === 0
        ? uploads
        : uploads.filter(upload =>
            activeTagFilters.every(tagId =>
                upload.tags?.some(tag => tag.id === tagId)
            )
        );

    const allSelected = filteredUploads.length > 0
        && filteredUploads.every(upload => selectedIds.includes(upload.id!));

    function toggleAll() {

        const filteredIds = filteredUploads.map(upload => upload.id!);

        setSelectedIds(current =>
            allSelected
                ? current.filter(id => !filteredIds.includes(id))
                : [...current, ...filteredIds.filter(id => !current.includes(id))]
        );
    }

    function toggleTagFilter(tagId: number) {
        setActiveTagFilters(current =>
            current.includes(tagId)
                ? current.filter(existing => existing !== tagId)
                : [...current, tagId]
        );
    }

    function toggleOne(id: number) {
        setSelectedIds(current =>
            current.includes(id)
                ? current.filter(existing => existing !== id)
                : [...current, id]
        );
    }

    async function deleteSelected() {

        if (selectedIds.length === 0)
            return;

        if (!confirm(`${selectedIds.length} Datei(en) wirklich löschen?`))
            return;

        setDeleting(true);

        const results = await Promise.all(
            selectedIds.map(id =>
                fetch(`/api/upload/${id}`, { method: "DELETE" })
            )
        );

        setDeleting(false);

        if (results.some(res => !res.ok)) {
            alert("Nicht alle Dateien konnten gelöscht werden.");
        }

        setSelectedIds([]);
        router.refresh();
    }

    return (
        <div>

            <div className="mb-2">
                <button
                    onClick={deleteSelected}
                    disabled={selectedIds.length === 0 || deleting}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {deleting
                        ? "Löschen läuft..."
                        : `Ausgewählte löschen (${selectedIds.length})`}
                </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">

                <span className="text-sm text-gray-600">
                    Nach Tags filtern:
                </span>

                {allTags.map(tag => {

                    const active = activeTagFilters.includes(tag.id!);

                    return (
                        <button
                            key={tag.id}
                            onClick={() => toggleTagFilter(tag.id!)}
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

                {activeTagFilters.length > 0 && (
                    <button
                        onClick={() => setActiveTagFilters([])}
                        className="text-xs text-gray-500 underline"
                    >
                        Filter zurücksetzen
                    </button>
                )}

            </div>

            <table className="min-w-full border border-gray-300 border-collapse">

            <thead className="bg-gray-100 text-black">

            <tr>
                <th className="border border-gray-300 p-2 text-center">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Alle auswählen"
                    />
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    ID
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    Name
                </th>

                <th className="border border-gray-300 p-2 text-right">
                    Größe
                </th>

                <th className="border border-gray-300 p-2 text-right">
                    Maße
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    Typ
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    Hochgeladen
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    Datei
                </th>

                <th className="border border-gray-300 p-2 text-left">
                    Tags
                </th>
            </tr>

            </thead>

            <tbody>

            {activeTagFilters.length > 0 && filteredUploads.length === 0 && (

                <tr>
                    <td
                        colSpan={9}
                        className="border border-gray-300 p-2 text-center text-gray-500"
                    >
                        Keine Bilder mit allen ausgewählten Tags gefunden.
                    </td>
                </tr>

            )}

            {filteredUploads.map(upload => (

                <tr
                    key={upload.id}
                    className="hover:bg-gray-50"
                >

                    <td className="border border-gray-300 p-2 text-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(upload.id!)}
                            onChange={() => toggleOne(upload.id!)}
                            aria-label={`${upload.name} auswählen`}
                        />
                    </td>

                    <td className="border border-gray-300 p-2">
                        {upload.id}
                    </td>

                    <td className="border border-gray-300 p-2">
                        {upload.name}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                        {formatSize(upload.size)}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                        {upload.width && upload.height
                            ? `${upload.width} × ${upload.height}`
                            : "—"}
                    </td>

                    <td className="border border-gray-300 p-2">
                        {upload.mimeType}
                    </td>

                    <td className="border border-gray-300 p-2">
                        {upload.createdAtFormatted}
                    </td>

                    <td className="border border-gray-300 p-2">
                        <a
                            href={upload.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Öffnen
                        </a>
                    </td>

                    <td className="border border-gray-300 p-2">
                        <TagEditor
                            uploadId={upload.id!}
                            tags={upload.tags ?? []}
                            allTags={allTags}
                        />
                    </td>

                </tr>

            ))}

            </tbody>

            </table>

        </div>
    );
}