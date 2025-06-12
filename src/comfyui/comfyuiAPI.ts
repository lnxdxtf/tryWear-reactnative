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
		const url = `${process.env.EXPO_PUBLIC_COMFYU_API_URL}/prompt`;
		const data = JSON.stringify({ prompt: workflow });
		try {
			const response = await fetch(url, {
				body: data,
				method: "POST",
				headers: {
					"content-type": "application/json",
					accept: "application/json, text/plain, */*",
				},
			});
		
			if (response.ok) {
				const json = await response.json();
				return json;
			}
			throw new Error(
				`Error api prompting on comfyui: ${response.status} ${response.statusText}`,
			);
		} catch (error) {
			console.error("[ComfyUIAPI] Fetch error:", error);
			throw error;
		}
	}
}
