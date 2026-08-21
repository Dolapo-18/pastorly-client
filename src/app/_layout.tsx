import "../../global.css";
import "@/lib/nativewind";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";

import { SplashPlaceholder } from "@/components/common/splash-placeholder";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { useAppTheme } from "@/hooks/use-app-theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, isDark } = useAppTheme();
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  if (!fontsLoaded && !fontError) {
    return <SplashPlaceholder />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AuthBootstrap>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: "fade",
          }}
        />
      </AuthBootstrap>
    </SafeAreaProvider>
  );
}
