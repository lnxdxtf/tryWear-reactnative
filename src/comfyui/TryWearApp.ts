import ComfyUIAPI from "./comfyuiAPI";

export default class TryWearApp {
	workflow = ComfyUIAPI.GetWorkflow("TryWear_Workflow");

	loadImages(
		user: string,
		imgUser: string,
		imgCloth: string,
		imgUserMask: string,
	) {
		this.workflow[50].inputs.image = imgUser;
		this.workflow[52].inputs.image = imgCloth;
		this.workflow[53].inputs.image = imgUserMask;
	}

	generateImage() {}
}
