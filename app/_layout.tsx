import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitle: "",
				headerBackground: () => <View  style={{padding:20, backgroundColor: "#09090b", flex: 1, alignItems: "center", justifyContent:"center" }}><Text style={{fontWeight: "bold",fontSize: 42, color: "#ffffff"}}>Try Wear</Text></View>,
				contentStyle: { backgroundColor: "#09090b" },
			}}
		/>
	);
}

// MAIN COLORS
// BASE 100 - #09090b
// BASE 200 - #18181b
// BASE 300 - #262629

// PRIMARY - #4f46e5
// SECONDARY - #f59e0b
// ACCENT - #ec4899