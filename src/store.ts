import { create } from "zustand";
import TryWearApp from "./comfyui/TryWearApp";

export const TryWearStore = create((set) => ({
	user: Math.random().toString(36).substring(2, 15), // Random user ID for testing

	imgUser: null as string | null,
	setImgUser: (img: string | null) => set({ imgUser: img }),

	imgUserMask: null as string | null,
	setImgUserMask: (img: string | null) => set({ imgUserMask: img }),

	imgCloth: null as string | null,
	setImgCloth: (img: string | null) => set({ imgCloth: img }),

	imgGenerated: null as string | null,
	setImgGenerated: (img: string | null) => set({ imgGenerated: img }),

	tryWearApp: new TryWearApp(),
}));
