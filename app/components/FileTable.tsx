import {UploadRecord} from "@/types/upload";
import {TagRecord} from "@/types/tag";
import DeleteButton from "./DeleteButton";
import TagEditor from "./TagEditor";

interface FileTableProps {
    uploads: UploadRecord[];
    allTags: TagRecord[];
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
                        {upload.size.toLocaleString("de-DE")}
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