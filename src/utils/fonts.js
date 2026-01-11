import { Platform } from "react-native";

export default Fonts = {
  whitneyLight: Platform.OS === "ios" ? "Whitney-Light" : "whitneylight",
  whitneyLightItalic:
    Platform.OS === "ios" ? "Whitney-LightItalic" : "whitneylightitalic",
  whitneyMedium: Platform.OS === "ios" ? "Whitney-Medium" : "whitneymedium",
  whitneyMediumItalic:
    Platform.OS === "ios" ? "Whitney-MediumItalic" : "whitneymediumitalic",
  whitneyBold: Platform.OS === "ios" ? "Whitney-Bold" : "whitneybold",
  whitneySemiBold:
    Platform.OS === "ios" ? "Whitney-Semibold" : "whitneysemibold",
  whitneySemiboldItalic:
    Platform.OS === "ios" ? "Whitney-SemiboldItalic" : "WhitneySemiboldItalic",
  whitneyBook: Platform.OS === "ios" ? "Whitney-Book" : "whitneybook",
  whitneyBookItalic:
    Platform.OS === "ios" ? "Whitney-BookItalic" : "whitneybookitalic",
};
