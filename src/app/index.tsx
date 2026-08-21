import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PastorlyLogo } from "@/components/common/app-logo";
import { SPLASH_MIN_MS, splashGradient } from "@/constants/theme";

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasNavigated = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const showSplash = async () => {
      await ExpoSplashScreen.hideAsync();

      timer = setTimeout(() => {
        if (hasNavigated.current) return;
        hasNavigated.current = true;
        router.replace("/(auth)/welcome");
      }, SPLASH_MIN_MS);
    };

    showSplash();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={[...splashGradient.colors]}
        locations={[...splashGradient.locations]}
        className="flex-1"
      >
        <View
          className="flex-1 items-center justify-center px-10"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          <View className="items-center">
            <PastorlyLogo
              size={104}
              color="#FFFFFF"
              crossColor="#4F3DB5"
              showRing
              weight="bold"
            />
            <Text className="mt-6 font-display text-[36px] leading-[44px] tracking-tight text-white">
              Pastorly
            </Text>
            <Text className="mt-3 text-center font-figtree text-[15px] leading-[22px] text-white">
              Connecting pastors.{"\n"}Strengthening people.
            </Text>
          </View>
        </View>

        <View
          className="flex-row items-center justify-center gap-2"
          style={{ paddingBottom: Math.max(insets.bottom + 28, 40) }}
        >
          <View className="h-2 w-7 rounded-full bg-white/90" />
          <View className="h-2 w-2 rounded-full bg-white/28" />
          <View className="h-2 w-2 rounded-full bg-white/28" />
          <View className="h-2 w-2 rounded-full bg-white/28" />
        </View>
      </LinearGradient>
    </View>
  );
}
