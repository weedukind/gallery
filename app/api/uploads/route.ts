import { NextResponse } from "next/server";
import { getUploads } from "@/services/uploadService";

export async function GET() {

    const uploads = await getUploads();

    return NextResponse.json(uploads);
}