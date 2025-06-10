import AWS from "aws-sdk";

// biome-ignore lint: class with static methods
export default class S3Helper {
	static getSignedURL(filename: string): string {
		const s3 = new AWS.S3({
			region: process.env.EXPO_PUBLIC_S3_REGION,
			accessKeyId: process.env.EXPO_PUBLIC_S3_ACCESS_KEY,
			secretAccessKey: process.env.EXPO_PUBLIC_S3_SECRET_KEY,
		});

		const url = s3.getSignedUrl("putObject", {
			Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME,
			Key: `inputs/${filename}.png`,
			ContentType: "image/png",
			Expires: 30,
		});
		return url;
	}

	static async uploadImageToS3(data: string, fileName: string) {
		const s3_url = S3Helper.getSignedURL(fileName);
		// remove the base64 prefix if it exists
		const blob = S3Helper.base64ToBlob(
			data.includes(",") ? data.split(",")[1] : data,
			"image/png",
		);

		const response = await fetch(s3_url, {
			method: "PUT",
			headers: {
				"Content-Type": "image/png",
			},
			body: blob,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload image: ${response.statusText}`);
		}
		console.log(`Image uploaded successfully: ${fileName}`);
	}

	static base64ToBlob(
		base64Data: string,
		contentType = "",
		sliceSize = 512,
	): Blob {
		const byteCharacters = atob(base64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, { type: contentType });
	}
}
