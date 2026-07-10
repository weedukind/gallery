import { getUploads } from "@/services/uploadService";

export default async function UploadsPage() {

    const uploads = await getUploads();

    return (
        <div style={{ padding: 20 }}>

            <h1>Uploads</h1>

            <table border={1} cellPadding={8}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Größe</th>
                    <th>Typ</th>
                    <th>Hochgeladen</th>
                    <th>URL</th>
                </tr>
                </thead>

                <tbody>
                {uploads.map(upload => (
                    <tr key={upload.id}>
                        <td>{upload.id}</td>
                        <td>{upload.name}</td>
                        <td>{upload.size}</td>
                        <td>{upload.mimeType}</td>
                        <td>
                            {upload.created_at
                                ? new Date(upload.created_at).toLocaleString("de-DE")
                                : ""}
                        </td>
                        <td>
                            <a
                                href={upload.publicUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Öffnen
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

        </div>
    );
}