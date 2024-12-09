import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import NumberCard from "@/components/home/number_cards";

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
function Timer({ endDate, onTimerFinished, testID }: any) {
  const targetTime = endDate;
  const [currentTime, setCurrentTime] = useState(Date.now());
  const timeBetween = useMemo(
    () => targetTime - currentTime,
    [currentTime, targetTime],
  );

  // get the days, hours, minutes and seconds between the current time and the target time
  const days = Math.floor(
    timeBetween /
      (MILLISECONDS_IN_SECOND *
        SECONDS_IN_MINUTE *
        MINUTES_IN_HOUR *
        HOURS_IN_DAY),
  );
  const hours = Math.floor(
    (timeBetween %
      (MILLISECONDS_IN_SECOND *
        SECONDS_IN_MINUTE *
        MINUTES_IN_HOUR *
        HOURS_IN_DAY)) /
      (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR),
  );
  const minutes = Math.floor(
    (timeBetween %
      (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR)) /
      (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE),
  );
  const seconds = Math.floor(
    (timeBetween % (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE)) /
      MILLISECONDS_IN_SECOND,
  );

  // Update the timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = targetTime - Date.now();
      if (timeRemaining <= 0) {
        clearInterval(interval);
        onTimerFinished();
      } else {
        setCurrentTime(Date.now());
      }
    }, 1); // Updates each second
    return () => clearInterval(interval);
  }, [targetTime, onTimerFinished]);

  return (
    <View style={styles.container}>
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

export default Timer;
