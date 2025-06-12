import ComfyUIAPI from "./comfyuiAPI";

export default class TryWearApp {
	workflow = ComfyUIAPI.GetWorkflow("TryWear_Workflow");

	async generateImage(
		user: string,
		keyUserImg: string,
		keyClothImg: string,
		keyMaskImg: string,
	) {
        
		// Set images in the workflow
		this.workflow[50].inputs.image = keyUserImg;
		this.workflow[52].inputs.image = keyClothImg;
		this.workflow[53].inputs.image = keyMaskImg;

		// Set the path to save the output image on the s3
		this.workflow[49].inputs.filename_prefix = `${user}_output`;

		// Positive and negative prompts
        
		await ComfyUIAPI.PromptWorkflow(this.workflow);
        
	}
}
