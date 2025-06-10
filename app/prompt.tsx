import { ImageShowMain } from "@/components/ImageShow";
import S3Helper from "@/src/S3Helper";
import ComfyUIAPI from "@/src/comfyui/comfyuiAPI";
import { TryWearStore } from "@/src/store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View,
	Image,
} from "react-native";

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

export default function Prompt() {
	// @ts-ignore
	const user = TryWearStore((state) => state.user);

	// @ts-ignore
	const imgUser = TryWearStore((state) => state.imgUser);
	// @ts-ignore
	const setImgUser = TryWearStore((state) => state.setImgUser);
	// @ts-ignore
	const imgCloth = TryWearStore((state) => state.imgCloth);
	// @ts-ignore
	const setImgCloth = TryWearStore((state) => state.setImgCloth);
	// @ts-ignore
	const imgUserMask = TryWearStore((state) => state.imgUserMask);
	// @ts-ignore
	const setImgUserMask = TryWearStore((state) => state.setImgUserMask);

	const pickImage = async (isUser: boolean) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			isUser ? setImgUser(uri) : setImgCloth(uri);

			if (isUser) {
				router.push("/mask_painter");
			}
		}
	};

	const promptFN = async () => {
		const workflowName = "TryWear_Workflow";
		const workflow = ComfyUIAPI.GetWorkflow(workflowName);

		if (!imgCloth || !imgUser) {
			console.error(
				"Please select both user and cloth images before generating.",
			);
			return;
		}

		S3Helper.uploadImageToS3(imgCloth, `${user}_cloth`);
		S3Helper.uploadImageToS3(imgUser, `${user}_user`);
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
			<View
				style={{
					flexDirection: "column",
					alignItems: "center",
					gap: 5,
					borderWidth: 1,
					borderColor: "#ffffff",
				}}
			>
				<Text style={{ fontSize: 20, color: "#ffffff" }}>Photo + Mask</Text>
				<ImageBackground
					source={{ uri: imgUser }}
					style={{ width: 200, height: 200 }}
					resizeMode="cover"
				>
					{imgUserMask && (
						<Image
							source={{ uri: imgUserMask }}
							style={{
								width: 200,
								height: 200,
								position: "absolute",
								resizeMode: "cover",
								opacity: 0.9, // ← ajuste como quiser
							}}
							resizeMode="cover"
						/>
					)}
				</ImageBackground>
			</View>

			<View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
				{/* @ts-ignore */}
				<Pressable onPress={() => pickImage(true)} style={buttonStyle}>
					<Text style={textStyle}>
						{imgUser ? "Change Photo" : "Select your photo"}
					</Text>
				</Pressable>

				{imgUser && (
					// @ts-ignore
					<Pressable onPress={() => {setImgUser(null); setImgUserMask(null)}} style={deleteButtonStyle}>
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
