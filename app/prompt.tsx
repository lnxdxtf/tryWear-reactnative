import { ImageShowMain } from "@/components/ImageShow";
import S3Helper from "@/src/S3Helper";
import type TryWearApp from "@/src/comfyui/TryWearApp";
import { TryWearStore } from "@/src/store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
	Image,
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View,
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

	const generating = TryWearStore((state) => state.generating);
	const setGenerating = TryWearStore((state) => state.setGenerating);

	const setImgGenerated = TryWearStore((state) => state.setImgGenerated);

	// @ts-ignore
	const tryWearApp: TryWearApp = TryWearStore((state) => state.tryWearApp);

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
		try {

			setImgGenerated(null);

			if (generating) {
				return;
			}

			if (!imgUser || !imgCloth || !imgUserMask) {
				alert("Please select both user and cloth images, and mask the user image.");
				return;
			}
			const keyUserImg = await S3Helper.uploadImageToS3FromFile(
				imgUser,
				`${user}_user`,
			);
			const keyClothImg = await S3Helper.uploadImageToS3FromFile(
				imgCloth,
				`${user}_cloth`,
			);

			const keyMaskImg = await S3Helper.uploadImageToS3FromFile(
				imgUserMask,
				`${user}_mask`,
			);

			// Call Workflow
			// biome-ignore lint: Null check
			await tryWearApp.generateImage(user, keyUserImg!, keyClothImg!, keyMaskImg!);
			setGenerating(true);
			tryWearApp.getGeneratedImage(user, router);


		} catch (_err) {
			alert("Error generating image. Please try again.");
			console.error("Error generating image:", _err);
		}


	};

	return (
		<ScrollView
			contentContainerStyle={{
				alignItems: "center",
				gap: 20,
				paddingVertical: 20,
			}}
		>
			<Text style={{ fontSize: 12, color: "white", margin: 6 }}>
				User: {user}
			</Text>

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
				>
					{imgUserMask && (
						<Image
							source={{ uri: imgUserMask }}
							style={{
								width: 200,
								height: 200,
								position: "absolute",
								opacity: 0.9, // ← ajuste como quiser
							}}
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
					<Pressable
						onPress={() => {
							setImgUser(null);
							setImgUserMask(null);
						}}
						style={deleteButtonStyle}
					>
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
					padding: 2,
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
