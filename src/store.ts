import { create } from "zustand";

export const TryWearStore = create((set) => ({
	user: crypto.randomUUID().substring(0, 6), // Generate a random user ID
}));
