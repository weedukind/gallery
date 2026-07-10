"use client";

import {useState} from "react"

export default function Page() {
    const [files, setFiles] = useState<any[]>([]);

    async function upload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const form = new FormData();

        for (const file of e.target.files) {
            form.append("files", file);
        }

        const res = await fetch("/api/upload", {
            method: "POST",
            body: form
        });

        const data = await res.json();
        setFiles(data);
    }

    return (
        <div style={{padding: 20}}>
            <input type={"file"} multiple onChange={upload}/>

            <table border={1} cellPadding={8} style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Cloudflare URL</th>
                </tr>
                </thead>
                <tbody>
                {
                    files.map((f, i) => {
                        return (
                            <tr key={i}>
                                <td>{f.fileName}</td>
                                <td>
                                    <a href={f.publicUrl} target="_blank" rel="noreferrer">
                                        {f.publicUrl}
                                    </a>
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
}