import { hydrateUploadedFiles } from "../services/storageService.js";

const SERVICE_URLS = {
    face: process.env.FACE_VERIFICATION_URL,
    document: process.env.DOCUMENT_VERIFICATION_URL,
    age: process.env.AGE_VERIFICATION_URL
};

async function forwardMultipart(service, endpoint, fields, files) {
    const base = SERVICE_URLS[service];
    if (!base) throw Object.assign(new Error(service + " verification service is not configured."), { status: 503 });
    const body = new FormData();
    for (const [key, value] of Object.entries(fields || {})) {
        if (value !== undefined && value !== null && value !== "") body.append(key, String(value));
    }
    for (const [field, file] of Object.entries(files || {})) {
        if (!file?.buffer) throw Object.assign(new Error("A required uploaded file is missing."), { status: 400 });
        body.append(field, new Blob([file.buffer], { type: file.mimetype || "application/octet-stream" }), file.originalname || "upload");
    }
    const url = new URL(endpoint, base.replace(/\/+$/, "") + "/");
    const response = await fetch(url, { method: "POST", body });
    const result = await response.json().catch(() => null);
    if (!result) throw new Error("Verification service returned an invalid response.");
    return { status: response.status, result };
}

async function getUploadedFiles(req) {
    return hydrateUploadedFiles(req.body?.files || {});
}

export async function verifyFace(req, res) {
    try {
        const files = await getUploadedFiles(req);
        const source = files.valid_id_front?.[0];
        const target = files.verification_photo?.[0];
        const { status, result } = await forwardMultipart("face", "verify-face", {}, {
            source_image: source,
            target_image: target
        });
        return res.status(status).json(result);
    } catch (error) {
        return res.status(error.status || 502).json({ success: false, verified: false, livenessPassed: false, message: error.message || "Face verification failed." });
    }
}

export async function verifyAge(req, res) {
    try {
        const files = await getUploadedFiles(req);
        const document = files.valid_id_front?.[0];
        const { status, result } = await forwardMultipart("age", "verify-age", {
            date_of_birth: req.body?.date_of_birth
        }, { document });
        return res.status(status).json(result);
    } catch (error) {
        return res.status(error.status || 502).json({ success: false, verified: false, message: error.message || "Age verification failed." });
    }
}

export async function screenDocument(req, res) {
    try {
        const files = await getUploadedFiles(req);
        const document = files.document?.[0];
        const fields = {
            document_type: req.body?.document_type,
            first_name: req.body?.first_name,
            middle_name: req.body?.middle_name,
            surname: req.body?.surname,
            date_of_birth: req.body?.date_of_birth,
            place_of_birth: req.body?.place_of_birth,
            address: req.body?.address
        };
        const { status, result } = await forwardMultipart("document", "screen-document", fields, { document });
        return res.status(status).json(result);
    } catch (error) {
        return res.status(error.status || 502).json({ success: false, passed: false, message: error.message || "Document screening failed." });
    }
}
