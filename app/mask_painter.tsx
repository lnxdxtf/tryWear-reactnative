import { TryWearStore } from "@/src/store";
import {
	Canvas,
	Path,
	type SkPath,
	Skia,
	Image as SkiaImage,
	useImage,
} from "@shopify/react-native-skia";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import type { View as RNView } from "react-native";
import { Button, Dimensions, Text, TouchableOpacity, View } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

const { width: screenW, height: screenH } = Dimensions.get("window");

export default function MaskPainter() {
	const imgUser = TryWearStore((state) => state.imgUser);
	const setImgUserMask = TryWearStore((state) => state.setImgUserMask);

	const skiaImage = useImage(imgUser || "");

	const [paths, setPaths] = useState<SkPath[]>([]);
	const [exportPaths, setExportPaths] = useState<SkPath[] | null>(null);
	const currentPath = useRef<SkPath | null>(null);
	const canvasRef = useRef<RNView | null>(null);
	const maskCanvasRef = useRef<RNView | null>(null);
	const [brushSize, setBrushSize] = useState<number>(20);

	const onStart = useCallback(({ x, y }) => {
		const p = Skia.Path.Make();
		p.moveTo(x, y);
		currentPath.current = p;
		setPaths((prev) => [...prev, p]);
	}, []);

	const onUpdate = useCallback(({ x, y }) => {
		if (currentPath.current) {
			currentPath.current.lineTo(x, y);
			setPaths((prev) => {
				const updated = [...prev];
				updated[updated.length - 1] = currentPath.current!.copy();
				return updated;
			});
		}
	}, []);

	const gesture = Gesture.Pan().onStart(onStart).onUpdate(onUpdate);

	const handleExport = async () => {
		try {
			if (!maskCanvasRef.current) return;

			// Capture the mask canvas
			const uri = await captureRef(maskCanvasRef.current, {
				format: "png",
				quality: 1,
				result: "tmpfile",
			});

			setImgUserMask(uri);

			router.back()
		} catch (_err) {
			alert("Error exporting mask. Please try again.");
			console.error("Error exporting mask:", _err);

		}
	};

	const handleUndo = () => setPaths((prev) => prev.slice(0, -1));
	const handleClear = () => setPaths([]);

	const canvasWidth =
		typeof skiaImage?.width === "number" ? skiaImage.width : screenW;
	const canvasHeight =
		typeof skiaImage?.height === "number" ? skiaImage.height : screenH;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			{/* Visual Canvas */}
			<View
				ref={canvasRef}
				style={{
					width: screenW,
					height: screenH * 0.75,
					overflow: "hidden",
					gap: 10,
				}}
			>
				<Text style={{ color: "white", textAlign: "center", fontSize: 24 }}>
					Draw Your Mask
				</Text>
				<Text style={{ color: "white", fontSize: 14, marginBottom: 10 }}>
					Use your finger to draw over the clothing you want to replace.
				</Text>

				<GestureDetector gesture={gesture}>
					<Canvas style={{ flex: 1 }}>
						{skiaImage && (
							<SkiaImage
								image={skiaImage}
								x={0}
								y={0}
								width={screenW}
								height={screenH * 0.75}
							/>
						)}
						{paths.map((p, i) => (
							<Path
								key={i}
								path={p}
								color="black"
								opacity={0.6}
								style="stroke"
								strokeWidth={brushSize}
							/>
						))}
					</Canvas>
				</GestureDetector>
			</View>

			{/* Export Canvas (same resolution as original image) */}
			<View
				ref={maskCanvasRef}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					opacity: 0.1,
					zIndex: -1,
					width: canvasWidth,
					height: canvasHeight,
					backgroundColor: "transparent",
				}}
			>
				<Canvas style={{ width: canvasWidth, height: canvasHeight }}>
					{(exportPaths ?? paths).map((p, i) => (
						<Path
							key={i}
							path={p}
							color="black"
							style="stroke"
							opacity={1}
							strokeWidth={brushSize}
						/>
					))}
				</Canvas>
			</View>

			{/* UI Controls */}
			<View style={{ padding: 10, gap: 10 }}>
				<Text style={{ color: "white" }}>Brush Size: {brushSize}</Text>
				<View style={{ flexDirection: "row", gap: 10 }}>
					{[10, 20, 30].map((size) => (
						<TouchableOpacity
							key={size}
							onPress={() => setBrushSize(size)}
							style={{
								backgroundColor: brushSize === size ? "#FFCB47" : "#333",
								padding: 10,
								borderRadius: 10,
							}}
						>
							<Text style={{ color: "white" }}>{size}</Text>
						</TouchableOpacity>
					))}
				</View>

				<View style={{ flexDirection: "row", gap: 10 }}>
					<Button title="Desfazer" onPress={handleUndo} />
					<Button title="Limpar" onPress={handleClear} />
					<Button title="Salvar Máscara" onPress={handleExport} />
				</View>
			</View>
		</GestureHandlerRootView>
	);
}
