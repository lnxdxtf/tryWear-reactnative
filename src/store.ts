import { create } from "zustand";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


export const TryWearStore = create((set) => ({

	user: uuidv4().substring(0, 6), // Generate a random user ID

	imgUser: null as string | null,
	setImgUser: (img: string | null) => set({ imgUser: img }),
	
	imgUserMask: null as string | null,
	setImgUserMask: (img: string | null) => set({ imgUserMask: img }),

	imgCloth: null as string | null,
	setImgCloth: (img: string | null) => set({ imgCloth: img }),

}));
