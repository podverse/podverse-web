import { ASSETS } from "../constants/assets";
import { UITheme } from "./theme";

export const getBrandLogoSrc = ((theme: UITheme) => {
  switch (theme) {
    case "dark":
      return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
    case "light":
      return ASSETS.IMAGES.BRANDING.BRAND.BLACK;
    default:
      return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
  }
});