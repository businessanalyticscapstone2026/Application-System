import { randomUUID } from "node:crypto";
import path from "node:path";
import { supabase } from "../supabase.js";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
]);

function safeFileName(name) {
    const base = path.basename(String(name || "upload"))
        .normalize("NFKC")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 100);
    return base || "upload";
}

/**
 * Create a short-lived, single-object upload permission. The browser uploads
 * directly to the private Supabase Storage bucket, avoiding Vercel's 4.5 MB
 * function request-body limit. The service-role key never leaves this server.
 */
export async function createUploadTicket({ fileName, contentType, size }) {
    const normalizedType = String(contentType || "").toLowerCase();
    const fileSize = Number(size);

    if (!ALLOWED_TYPES.has(normalizedType)) {
        throw Object.assign(new Error("Unsupported file type."), { status: 400 });
    }
    if (!Number.isSafeInteger(fileSize) || fileSize <= 0 || fileSize > MAX_UPLOAD_BYTES) {
        throw Object.assign(new Error("Each file must be between 1 byte and 20 MB."), { status: 413 });
    }

    const pathName = `incoming/${randomUUID()}/${safeFileName(fileName)}`;
    const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUploadUrl(pathName, { upsert: false });

    if (error) throw error;
    return {
        path: data.path || pathName,
        token: data.token
    };
}

export function isUploadedFile(file) {
    return Boolean(
        file &&
        typeof file === "object" &&
        typeof file.path === "string" &&
        file.path.startsWith("incoming/") &&
        !file.path.includes("..") &&
        typeof file.originalname === "string" &&
        typeof file.mimetype === "string"
    );
}

export async function hydrateUploadedFiles(files) {
    const hydrated = {};
    for (const [field, entries] of Object.entries(files || {})) {
        if (!Array.isArray(entries)) continue;
        hydrated[field] = [];
        for (const file of entries) {
            if (!isUploadedFile(file)) {
                hydrated[field].push(file);
                continue;
            }
            const { data, error } = await supabase.storage
                .from("documents")
                .download(file.path);
            if (error) throw error;
            const buffer = Buffer.from(await data.arrayBuffer());
            hydrated[field].push({ ...file, buffer });
        }
    }
    return hydrated;
}

export async function uploadFile(applicationId, file, folder) {
    if (!file) return null;

    // New Vercel flow: the file is already in the private bucket.
    if (isUploadedFile(file)) {
        const destination = `${applicationId}/${folder}-${Date.now()}-${safeFileName(file.originalname)}`;
        const { error } = await supabase.storage
            .from("documents")
            .move(file.path, destination);
        if (error) throw error;
        return destination;
    }

    // Legacy Render flow: Multer supplies an in-memory buffer.
    if (!file.buffer) {
        throw new Error("Uploaded file reference is invalid.");
    }

    const fileName = `${applicationId}/${folder}-${Date.now()}-${safeFileName(file.originalname)}`;
    const { error } = await supabase.storage
        .from("documents")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;
    return fileName;
}
