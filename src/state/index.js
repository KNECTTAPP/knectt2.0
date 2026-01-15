import  {create}  from "zustand";
import { createAppsFlyerSlice } from "./appsFlyerSlice";

export const useStore = create((...a) => ({
  ...createAppsFlyerSlice(...a),
}));
