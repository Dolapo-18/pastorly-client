import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { splashGradient } from "@/constants/theme";

export function SplashPlaceholder() {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={[...splashGradient.colors]}
        locations={[...splashGradient.locations]}
        className="flex-1"
      />
    </View>
  );
}
