import AWS from "aws-sdk";

// biome-ignore lint: class with static methods
export default class S3Helper {
	static getContentType(data: string): string {
		if (data.startsWith("data:image/png")) return "image/png";
		if (data.startsWith("data:image/jpeg")) return "image/jpeg";
		if (data.startsWith("data:image/jpg")) return "image/jpg";
		if (data.startsWith("data:image/webp")) return "image/webp";
		if (data.startsWith("file://")) {
			if (data.endsWith(".png")) return "image/png";
			if (data.endsWith(".jpg") || data.endsWith(".jpeg")) return "image/jpeg";
			if (data.endsWith(".webp")) return "image/webp";
		}
		return "image/png"; // default
	}

	static async uploadImageToS3FromFile(filePath: string, fileNameOnS3: string) {
		try {
			AWS.config.update({
				region: process.env.EXPO_PUBLIC_S3_REGION,
				accessKeyId: process.env.EXPO_PUBLIC_S3_ACCESS_KEY,
				secretAccessKey: process.env.EXPO_PUBLIC_S3_SECRET_KEY,
			});
			const s3Client = new AWS.S3();

			const fileData = await fetch(filePath).then((response) => response.blob());

			const resp = s3Client
				.upload({
					Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME || "comfyui-generated",
					Key: `inputs/${fileNameOnS3}`,
					Body: fileData,
					ContentType: S3Helper.getContentType(filePath),
				})
				.promise();

			await resp;
			// biome-ignore lint:
		} catch (_err:any) {
			alert(`Error uploading image to S3. Please try again. ${_err.message}`);
			console.error("Error uploading image to S3:", _err);
		}
	}
}
