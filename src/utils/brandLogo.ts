import { ASSETS } from "../constants/assets";
import { UITheme } from "./uiTheme";

export const getBrandLogoSrc = ((uiTheme: UITheme) => {
  switch (uiTheme) {
    case "dark":
      return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
    case "light":
      return ASSETS.IMAGES.BRANDING.BRAND.BLACK;
    default:
      return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
  }
});