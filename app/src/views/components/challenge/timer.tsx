import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import NumberCard from "@/src/views/components/challenge/number_cards";
import { useTimerViewModel } from "@/src/viewmodels/components/challenge/TimerViewModel";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

/**
 * The Timer component displays a timer.
 * @param endDate : the end date of the timer
 * @param onTimerFinished : function to call when the timer is finished
 * @param testID : testID for the component
 * @returns : a component for the timer
 */
export function Timer({ endDate, onTimerFinished, testID }: any) {
  const { days, hours, minutes, seconds } = useTimerViewModel({
    endDate,
    onTimerFinished,
  });

  return (
    <View style={styles.container} testID={testID}>
      <NumberCard number={days} testID="days" />
      <NumberCard number={hours} testID="hours" />
      <NumberCard number={minutes} testID="minutes" />
      <NumberCard number={seconds} testID="seconds" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDivider: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
