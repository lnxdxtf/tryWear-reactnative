import TryWear_Workflow from "@/src/comfyui/workflows/TryWear_Workflow.json";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class ComfyUIAPI {
	static GetWorkflow(workflowName: string) {
		switch (workflowName) {
			case "TryWear_Workflow":
				return TryWear_Workflow;
			default:
				return TryWear_Workflow;
		}
	}

	static async PromptWorkflow(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		workflow: any,
	) {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_COMFYU_API_URL}/prompt`,
			{
				body: JSON.stringify({ prompt: workflow }),
				method: "POST",
			},
		);
		if (response.ok) {
			return await response.json();
		}
		throw new Error(
			`Error api prompting on comfyui: ${response.status} ${response.statusText}`,
		);
	}

	static async UploadImage(image_name: string, image_data: any) {
		const formData = new FormData();
		formData.append("name", `${image_name}.png`);
		formData.append("type", "image/png");
		formData.append("file", image_data);

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_COMFYU_API_URL}/upload/image`,
			{
				body: formData,
				headers: {
					"Content-Type": "multipart/form-data",
					Accept: "application/json",
				},

				method: "POST",
			},
		);
		if (response.ok) {
			return await response.json();
		}
		throw new Error(
			`Error api uploading image to comfyui: ${response.status} ${response.statusText}`,
		);
	}
}
