import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function errorResponse(status: number, message: string) {
	return NextResponse.json(
		{ status: "fail", statusCode: status, message },
		{ status },
	);
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const file = formData.get("file");

	if (!(file instanceof File)) {
		return errorResponse(400, "No file provided.");
	}

	if (file.size > 2 * 1024 * 1024) {
		return errorResponse(400, "Cover image must be under 2MB.");
	}

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const dataUri = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

		const result: UploadApiResponse = await cloudinary.uploader.upload(
			dataUri,
			{
				folder: "cover",
				resource_type: "image",
				transformation: [{ width: 1200, height: 400, crop: "fill" }],
			},
		);

		return NextResponse.json({
			status: "success",
			statusCode: 200,
			message: "Cover image uploaded successfully.",
			data: { url: result.secure_url },
		});
	} catch (err) {
		console.error("[upload/cover]", err);
		const message =
			err instanceof Error ? err.message : "Upload failed. Please try again.";
		return errorResponse(500, message);
	}
}
