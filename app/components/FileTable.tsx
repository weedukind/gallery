import {UploadRecord} from "@/types/upload";
import {TagRecord} from "@/types/tag";
import DeleteButton from "./DeleteButton";
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

    return (
        <table className="min-w-full border border-gray-300 border-collapse">

            <thead className="bg-gray-100 text-black">

            <tr>
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

                <th className="border border-gray-300 p-2 text-center">
                    Aktionen
                </th>
            </tr>

            </thead>

            <tbody>

            {uploads.map(upload => (

                <tr
                    key={upload.id}
                    className="hover:bg-gray-50"
                >

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

                    <td className="border border-gray-300 p-2 text-center">
                        <DeleteButton id={upload.id!}/>
                    </td>

                </tr>

            ))}

            </tbody>

        </table>
    );
}