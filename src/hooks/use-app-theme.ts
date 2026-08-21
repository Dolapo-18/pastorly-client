import { useColorScheme } from "react-native";

import { themePalettes } from "@/constants/theme";

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const scheme = systemScheme === "dark" ? "dark" : "light";
  const isDark = scheme === "dark";
  const colors = themePalettes[scheme];

  return { scheme, isDark, colors };
}
