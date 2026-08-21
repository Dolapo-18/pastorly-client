import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const welcomeBg = require("../../../assets/images/welcome-bg.jpg");

/** Matches welcome reference mockup */
const COLORS = {
  deep: "#0D0B1F",
  primaryTop: "#7B6EF0",
  primaryBottom: "#5B4BD4",
  secondaryFill: "rgba(255,255,255,0.16)",
  secondaryBorder: "rgba(255,255,255,0.28)",
} as const;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground
        source={welcomeBg}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(13,11,31,0.02)",
            "rgba(13,11,31,0.22)",
            "rgba(13,11,31,0.68)",
            COLORS.deep,
          ]}
          locations={[0, 0.36, 0.6, 0.82]}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + 16,
              paddingBottom: Math.max(insets.bottom + 16, 32),
            },
          ]}
        >
          <View style={styles.copyWrap}>
            <View style={styles.copyBlock}>
              <Text style={styles.headline}>
                Your ministry,{"\n"}connected.
              </Text>
              <Text style={styles.subheadline}>
                Help your members pray, grow, connect, and receive the care they
                need.
              </Text>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get Started"
                onPress={() => router.push("/(auth)/role-select")}
                style={styles.buttonShell}
              >
                {({ pressed }) => (
                  <LinearGradient
                    colors={[COLORS.primaryTop, COLORS.primaryBottom]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[styles.primaryFill, pressed && styles.pressed]}
                  >
                    <Text style={styles.primaryLabel}>Get Started</Text>
                  </LinearGradient>
                )}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="I already have an account"
                onPress={() => router.push("/(auth)/member/join")}
                style={styles.buttonShell}
              >
                {({ pressed }) => (
                  <View style={[styles.secondaryFill, pressed && styles.pressed]}>
                    <Text style={styles.secondaryLabel}>
                      I already have an account
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            <Text style={styles.legal}>
              By continuing, you agree to our{" "}
              <Text style={styles.legalBold}>Terms of Service</Text> and{" "}
              <Text style={styles.legalBold}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const HEIGHT = 56;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.deep,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    transform: [{ translateY: -40 }, { scale: 1.08 }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  copyWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBlock: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  copyBlock: {
    alignItems: "center",
    gap: 14,
  },
  headline: {
    fontFamily: "Figtree_700Bold",
    fontSize: 31,
    lineHeight: 39,
    letterSpacing: -0.3,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subheadline: {
    fontFamily: "Figtree_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
    maxWidth: 316,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  buttonShell: {
    width: "100%",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.92,
  },
  primaryFill: {
    width: "100%",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
  },
  secondaryFill: {
    width: "100%",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    backgroundColor: COLORS.secondaryFill,
    borderWidth: 1,
    borderColor: COLORS.secondaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLabel: {
    fontFamily: "Figtree_500Medium",
    fontSize: 17,
    color: "#FFFFFF",
  },
  legal: {
    fontFamily: "Figtree_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255,255,255,0.48)",
    textAlign: "center",
    maxWidth: 300,
  },
  legalBold: {
    fontFamily: "Figtree_700Bold",
    color: "rgba(255,255,255,0.72)",
  },
});
