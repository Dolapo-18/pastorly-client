import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { AuthField, AuthPrimaryButton, AuthScreen } from "@/components/auth";
import { ImageUploadCircle } from "@/components/form/image-upload-circle";
import { OptionSheet } from "@/components/form/option-sheet";
import { SelectField } from "@/components/form/select-field";
import { TextAreaField } from "@/components/form/textarea-field";
import { useAppTheme } from "@/hooks/use-app-theme";
import { comingSoon, routes } from "@/lib/routes";

const EXPECTATIONS = [
  "Financial Breakthrough",
  "Healing & Restoration",
  "Fruit of the Womb",
  "Marriage & Family",
  "Career & Employment",
  "Spiritual Growth",
] as const;

export default function CreatePrayerGroupScreen() {
  const { colors } = useAppTheme();
  const [groupName, setGroupName] = useState("");
  const [expectation, setExpectation] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <AuthScreen
      showClose
      compactTop
      backFallbackHref={routes.prayerHub}
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            Create Prayer Group
          </Text>
          <Text
            className="font-figtree-medium text-[14px]"
            style={{ color: colors.textMuted }}
          >
            Step 1 of 2
          </Text>
        </View>

        <View className="items-center py-1">
          <ImageUploadCircle
            label={"Add\nGroup\nImage"}
            onPress={() => router.push(comingSoon("Add Group Image"))}
          />
        </View>

        <View className="gap-4">
          <AuthField
            label="Group Name"
            placeholder="Faith & Breakthrough"
            value={groupName}
            onChangeText={setGroupName}
          />
          <SelectField
            label="Prayer Expectation"
            placeholder="Financial Breakthrough"
            value={expectation}
            onPress={() => setSheetOpen(true)}
          />
          <TextAreaField
            label="Description"
            placeholder="A community trusting God for financial freedom and abundance."
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </View>

      <View className="pt-6">
        <AuthPrimaryButton
          label="Continue"
          onPress={() => router.push(comingSoon("Invite Group Members"))}
        />
      </View>

      <OptionSheet
        visible={sheetOpen}
        title="Prayer Expectation"
        options={EXPECTATIONS}
        value={expectation}
        onSelect={setExpectation}
        onClose={() => setSheetOpen(false)}
      />
    </AuthScreen>
  );
}
