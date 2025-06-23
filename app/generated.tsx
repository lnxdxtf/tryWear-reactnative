import { TryWearStore } from "@/src/store";
import { Image, ScrollView, Text, View } from "react-native";

export default function Index() {
	// @ts-ignore
	const imgGenerated = TryWearStore((state) => state.imgGenerated);

	return (
		<ScrollView
			style={{
				gap: 20,
			}}
		>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						width: 300,
						textAlign: "center",
						fontSize: 32,
						color: "#ffffff",
					}}
				>
					Generated
				</Text>
				{imgGenerated && (
					// <ImageShowMain src="imgGenerated" alt="trywea-generated" width={512} height={512} />
					<Image
						source={{ uri: imgGenerated }}
						style={{ width: 512, height: 512 }}
						resizeMode="center"
					/>
				)}
				{!imgGenerated && (
					<Text
						style={{
							width: 300,
							textAlign: "center",
							fontSize: 18,
							color: "#ffffff",
						}}
					>
						Loading...
					</Text>
				)}
			</View>
		</ScrollView>
	);
}
