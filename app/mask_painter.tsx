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
import { Button, Dimensions, Text, TouchableOpacity, View } from "react-native";
import type { View as RNView } from "react-native";
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
	// Corrige a proporção dos paths para exportação
	try {
		if (!maskCanvasRef.current) {
			console.warn("Canvas de máscara não encontrado");
			return;
		}

		const imgW = skiaImage?.width || screenW;
		const imgH = skiaImage?.height || screenH;
		const scaleX = imgW / screenW;
		const scaleY = imgH / (screenH * 0.75);

		// Função para escalar um path
		function scalePath(path: SkPath): SkPath {
			const cmd = path.toCmds();
			const newPath = Skia.Path.Make();
			for (const c of cmd) {
				if (c[0] === 'M') newPath.moveTo(c[1] * scaleX, c[2] * scaleY);
				else if (c[0] === 'L') newPath.lineTo(c[1] * scaleX, c[2] * scaleY);
				else if (c[0] === 'C') newPath.cubicTo(
					c[1] * scaleX, c[2] * scaleY,
					c[3] * scaleX, c[4] * scaleY,
					c[5] * scaleX, c[6] * scaleY
				);
				else if (c[0] === 'Q') newPath.quadTo(
					c[1] * scaleX, c[2] * scaleY,
					c[3] * scaleX, c[4] * scaleY
				);
				else if (c[0] === 'Z') newPath.close();
			}
			return newPath;
		}

		const scaledPaths = paths.map(scalePath);

		// Torna a máscara visível
		maskCanvasRef.current.setNativeProps({ style: { opacity: 1, zIndex: 9999 } });

		// Aguarda um frame para garantir renderização
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Renderiza os paths escalados na máscara temporariamente
		setPaths(scaledPaths);

		await new Promise((resolve) => setTimeout(resolve, 100));

		const uri = await captureRef(maskCanvasRef, {
			format: "png",
			quality: 1,
			result: "tmpfile",
		});

		// Esconde novamente
		maskCanvasRef.current.setNativeProps({ style: { opacity: 0.01, zIndex: -1 } });

		// Restaura os paths originais
		setPaths(paths);

		if (!uri || typeof uri !== "string" || uri.length === 0) {
			console.warn("Falha ao capturar a máscara");
			return;
		}

		setImgUserMask(uri);
		router.back();
	} catch (err) {
		// Tenta esconder novamente em caso de erro
		if (maskCanvasRef.current) {
			maskCanvasRef.current.setNativeProps({ style: { opacity: 0.01, zIndex: -1 } });
		}
		console.error("Erro ao exportar máscara:", err);
	}
};

	const handleUndo = () => setPaths((prev) => prev.slice(0, -1));
	const handleClear = () => setPaths([]);

const canvasWidth = typeof skiaImage?.width === 'number' ? skiaImage.width : screenW;
const canvasHeight = typeof skiaImage?.height === 'number' ? skiaImage.height : screenH;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			{/* Visual Canvas */}
			<View
				ref={canvasRef}
				style={{
					width: screenW,
					height: screenH * 0.75,
					backgroundColor: "black",
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
					opacity: 0.01,
					zIndex: -1,
					width: canvasWidth,
					height: canvasHeight,
					backgroundColor: "black",
				}}
				collapsable={false}
			>
				<Canvas style={{ width: canvasWidth, height: canvasHeight }}>
					{paths.map((p, i) => (
						<Path
							key={i}
							path={p}
							color="white"
							style="stroke"
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
