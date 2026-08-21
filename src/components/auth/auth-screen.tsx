import type { Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/common/back-button";
import { CloseButton } from "@/components/common/close-button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useKeepFocusedInputVisible } from "@/hooks/use-keep-focused-input-visible";

type AuthScreenProps = {
  children: ReactNode;
  contentClassName?: string;
  scrollEnabled?: boolean;
  backgroundColor?: string;
  /** Renders a back chevron above the content on pushed screens. */
  showBack?: boolean;
  /** Renders a dismiss cross above the content. Use on modal screens. */
  showClose?: boolean;
  /** Where the back chevron or dismiss cross goes when there is no history to pop. */
  backFallbackHref?: Href;
  /** Custom back handler — e.g. wizard step navigation instead of router.back(). */
  onBackPress?: () => void;
  /**
   * Skips the top safe-area padding. Modal sheets already sit below the status
   * bar, so the root window inset would double the gap.
   */
  compactTop?: boolean;
};

export function AuthScreen({
  children,
  contentClassName = "",
  scrollEnabled = true,
  backgroundColor,
  showBack = false,
  showClose = false,
  backFallbackHref,
  onBackPress,
  compactTop = false,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const keepFocusedInputVisible = useKeepFocusedInputVisible(scrollViewRef);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: backgroundColor ?? colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        onFocus={keepFocusedInputVisible}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow items-center px-7"
        contentContainerStyle={{
          paddingTop: compactTop ? 16 : insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="w-full max-w-[620px] flex-1">
          {showBack ? (
            <View className="mb-3">
              <BackButton fallbackHref={backFallbackHref} onPress={onBackPress} />
            </View>
          ) : null}
          {showClose ? (
            <View className="mb-3 items-end">
              <CloseButton fallbackHref={backFallbackHref} />
            </View>
          ) : null}
          <View className={`flex-1 ${contentClassName}`}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
