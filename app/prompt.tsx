import { ImageShowMain } from "@/components/ImageShow";
import S3Helper from "@/src/S3Helper";
import ComfyUIAPI from "@/src/comfyui/comfyuiAPI";
import { TryWearStore } from "@/src/store";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Prompt() {
	const [imgUser, setImgUser] = useState<string | null>(null);
	const [imgCloth, setImgCloth] = useState<string | null>(null);

	const pickImage = async (isUser: boolean) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			isUser ? setImgUser(uri) : setImgCloth(uri);
		}
	};

	const workflowName = "TryWear_Workflow";
	const workflow = ComfyUIAPI.GetWorkflow(workflowName);

	const user = TryWearStore((state) => state.user);

	const promptFN = async () => { 
		if (!imgCloth || !imgUser) {
			console.error(
				"Please select both user and cloth images before generating.",
			);
			return;
		}


		S3Helper.uploadImageToS3(imgCloth!, `${user}_cloth`);
    S3Helper.uploadImageToS3(imgUser!, `${user}_user`);
		// const response = await ComfyUIAPI.PromptWorkflow(workflow);
		// console.log("Response from ComfyUI:\n ", response);

		// const data = await ComfyUIAPI.UploadImage("image_test_do_pai", imgCloth);
		// console.log("Response from ComfyUI UploadImage:\n ", data);
	};

	return (
		<ScrollView
			contentContainerStyle={{
				alignItems: "center",
				gap: 20,
				paddingVertical: 20,
			}}
		>
			{/* USER IMAGE */}
			<ImageShowMain src={imgUser} alt="Your Photo" width={250} height={250} />

			<View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
				{/* @ts-ignore */}
				<Pressable onPress={() => pickImage(true)} style={buttonStyle}>
					<Text style={textStyle}>Select Your Photo</Text>
				</Pressable>

				{imgUser && (
					// @ts-ignore
					<Pressable onPress={() => setImgUser(null)} style={deleteButtonStyle}>
						<Text style={deleteTextStyle}>X</Text>
					</Pressable>
				)}
			</View>

			{/* CLOTH IMAGE */}
			<ImageShowMain
				src={imgCloth}
				alt="Cloth Photo"
				width={250}
				height={250}
			/>

			<View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
				{/* @ts-ignore */}
				<Pressable onPress={() => pickImage(false)} style={buttonStyle}>
					<Text style={textStyle}>Select Cloth Photo</Text>
				</Pressable>

				{imgCloth && (
					// @ts-ignore
					<Pressable
						onPress={() => setImgCloth(null)}
						style={deleteButtonStyle}
					>
						<Text style={deleteTextStyle}>X</Text>
					</Pressable>
				)}
			</View>

			{/* GENERATE BUTTON */}
			<Pressable
				onPress={promptFN}
				style={{
					backgroundColor: "#46494C",
					margin: 20,
					borderRadius: 10,
					padding: 10,
					elevation: 2,
					alignItems: "center",
				}}
			>
				<Text
					style={{
						color: "#ffffff",
						fontSize: 24,
						padding: 10,
						textAlign: "center",
					}}
				>
					Generate
				</Text>
			</Pressable>
		</ScrollView>
	);
}

const buttonStyle = {
	backgroundColor: "#FFCB47",
	borderRadius: 10,
	height: 50,
	width: 200,
	justifyContent: "center",
	alignItems: "center",
	elevation: 2,
};

const textStyle = {
	color: "#000000",
	fontSize: 18,
	padding: 10,
	textAlign: "center" as const,
};

const deleteButtonStyle = {
	backgroundColor: "red",
	borderRadius: 10,
	width: 50,
	height: 50,
	justifyContent: "center",
	alignItems: "center",
	elevation: 2,
};

const deleteTextStyle = {
	color: "#ffffff",
	fontSize: 18,
};
