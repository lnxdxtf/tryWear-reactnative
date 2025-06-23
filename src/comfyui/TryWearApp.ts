import type { Router } from "expo-router";
import S3Helper from "../S3Helper";
import { TryWearStore } from "../store";
import ComfyUIAPI from "./comfyuiAPI";

export default class TryWearApp {
	workflow = ComfyUIAPI.GetWorkflow("TryWear_Workflow");

	interval?: number;

	async generateImage(
		user: string,
		keyUserImg: string,
		keyClothImg: string,
		keyMaskImg: string,
	) {
		// Set Model
		// Change the model that uses SD 1.5 (Stable Diffusion 1.5)
		// this.workflow[31].inputs.ckpt_name = "SD_1_5_realDream_15SD15.safetensors"

		// Set images in the workflow
		this.workflow[50].inputs.image = keyUserImg;
		this.workflow[52].inputs.image = keyClothImg;
		this.workflow[53].inputs.image = keyMaskImg;

		// Set the path to save the output image on the s3
		this.workflow[49].inputs.filename_prefix = `${user}_output`;

		// Positive and negative prompts

		await ComfyUIAPI.PromptWorkflow(this.workflow);
	}

	async getGeneratedImage(user: string, router: Router) {
		router.push("/generated");
		const userKey = `outputs/${user}_output_00001_.png`;

		this.interval = setInterval(async () => {
			const data = await S3Helper.getImageFromS3(userKey);
			if (data) {
				TryWearStore.setState({
					generating: false,
				});				
				TryWearStore.setState({
					imgGenerated: data,
				});
				clearInterval(this.interval);
				this.interval = undefined;
			} 
		}, 10000);
	}
}
