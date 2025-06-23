import { type StoreApi, type UseBoundStore, create } from "zustand";
import TryWearApp from "./comfyui/TryWearApp";

export const TryWearStore: UseBoundStore<StoreApi<TTryWearStore>> = create(
	(set) => ({
		user: Math.random().toString(36).substring(2, 15), // Random user ID for testing

		imgUser: null as string | null,
		setImgUser: (img: string | null) => set({ imgUser: img }),

		imgUserMask: null as string | null,
		setImgUserMask: (img: string | null) => set({ imgUserMask: img }),

		imgCloth: null as string | null,
		setImgCloth: (img: string | null) => set({ imgCloth: img }),

		imgGenerated: null as string | null,
		setImgGenerated: (img: string | null) => set({ imgGenerated: img }),

		generating: false,
		setGenerating: (generateRunning: boolean) => set({ generating: generateRunning }),

		tryWearApp: new TryWearApp(),
	}),
);

type TTryWearStore = {
	user: string;
	imgUser: string | null;
	setImgUser: (img: string | null) => void;
	imgUserMask: string | null;
	setImgUserMask: (img: string | null) => void;
	imgCloth: string | null;
	setImgCloth: (img: string | null) => void;
	imgGenerated: string | null;
	setImgGenerated: (img: string | null) => void;
	generating: boolean;
	setGenerating: (generateRunning: boolean) => void;

	tryWearApp: TryWearApp;
};
