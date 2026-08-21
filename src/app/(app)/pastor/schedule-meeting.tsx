import { useState } from "react";
import { Text, View } from "react-native";

import { AuthField, AuthPrimaryButton, AuthScreen } from "@/components/auth";
import { OptionSheet } from "@/components/form/option-sheet";
import { SelectField } from "@/components/form/select-field";
import { scheduleOptions } from "@/features/prayer/schedule-meeting.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { goBackOr } from "@/lib/navigation";
import { routes } from "@/lib/routes";

type SheetKey = keyof typeof scheduleOptions;

const SHEET_TITLES: Record<SheetKey, string> = {
  group: "Prayer Group",
  date: "Date",
  time: "Time",
  duration: "Duration",
  repeat: "Repeat",
  reminder: "Reminder",
};

export default function ScheduleMeetingScreen() {
  const { colors } = useAppTheme();
  const [openSheet, setOpenSheet] = useState<SheetKey | null>(null);
  const [values, setValues] = useState<Partial<Record<SheetKey, string>>>({});
  const [focus, setFocus] = useState("");

  const select = (key: SheetKey) => (option: string) =>
    setValues((current) => ({ ...current, [key]: option }));

  return (
    <AuthScreen
      showBack
      backFallbackHref={routes.prayerHub}
      contentClassName="justify-between"
    >
      <View className="gap-6">
        <Text
          className="font-figtree-bold text-[26px] leading-[34px]"
          style={{ color: colors.text }}
        >
          Schedule Prayer Meeting
        </Text>

        <View className="gap-4">
          <SelectField
            label="Prayer Group"
            placeholder="Fruit of the Womb"
            value={values.group}
            onPress={() => setOpenSheet("group")}
          />
          <SelectField
            label="Date"
            placeholder="Thu, 15 May 2025"
            value={values.date}
            trailingIcon="calendar-blank-outline"
            onPress={() => setOpenSheet("date")}
          />
          <SelectField
            label="Time"
            placeholder="06:00 AM"
            value={values.time}
            trailingIcon="clock-outline"
            onPress={() => setOpenSheet("time")}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <SelectField
                label="Duration"
                placeholder="60 minutes"
                value={values.duration}
                onPress={() => setOpenSheet("duration")}
              />
            </View>
            <View className="flex-1">
              <SelectField
                label="Repeat"
                placeholder="Weekly"
                value={values.repeat}
                onPress={() => setOpenSheet("repeat")}
              />
            </View>
          </View>

          <AuthField
            label="Prayer Focus"
            placeholder="Divine Conception & Safe Delivery"
            value={focus}
            onChangeText={setFocus}
          />
          <SelectField
            label="Reminder"
            placeholder="15 minutes before"
            value={values.reminder}
            onPress={() => setOpenSheet("reminder")}
          />
        </View>
      </View>

      <View className="pt-6">
        <AuthPrimaryButton
          label="Schedule Meeting"
          onPress={() => goBackOr(routes.prayerHub)}
        />
      </View>

      {openSheet ? (
        <OptionSheet
          visible
          title={SHEET_TITLES[openSheet]}
          options={scheduleOptions[openSheet]}
          value={values[openSheet]}
          onSelect={select(openSheet)}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
    </AuthScreen>
  );
}
