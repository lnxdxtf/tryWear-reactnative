import S3Helper from "../S3Helper";
import { TryWearStore } from "../store";
import ComfyUIAPI from "./comfyuiAPI";

export default class TryWearApp {
	workflow = ComfyUIAPI.GetWorkflow("TryWear_Workflow");

	interval: any = null;

	async generateImage(
		user: string,
		keyUserImg: string,
		keyClothImg: string,
		keyMaskImg: string,
	) {

		// Set Model
		this.workflow[31].inputs.ckpt_name = "SD_1_5_realDream_15SD15.safetensors"

		// Set images in the workflow
		this.workflow[50].inputs.image = keyUserImg;
		this.workflow[52].inputs.image = keyClothImg;
		this.workflow[53].inputs.image = keyMaskImg;

		// Set the path to save the output image on the s3
		this.workflow[49].inputs.filename_prefix = `${user}_output`;

		// Positive and negative prompts

		await ComfyUIAPI.PromptWorkflow(this.workflow);

	}

	async getGeneratedImage(user: string) {
		let imgGenerated = TryWearStore((state) => state.imgGenerated);
		let userKey = `outputs/${user}_output.png`;

		this.interval = setInterval(async () => {
			const data = await S3Helper.getImageFromS3(userKey)
			if (data) {
				TryWearStore.setState({
					imgGenerated: data,
				});
				clearInterval(this.interval);
				this.interval = null;
			}
			else {
				console.log("Waiting for the image to be generated...");
			}

		}, 1000);

	}

}

