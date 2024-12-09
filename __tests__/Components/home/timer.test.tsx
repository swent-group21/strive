import React from "react";
import { render, act } from "@testing-library/react-native";
import Timer from "@/components/home/timer";

// Mock the NumberCard component to isolate Timer logic
jest.mock("@/components/home/number_cards", () => {
  const { Text } = require("react-native");
  return ({ number, testID }: { number: number; testID: string }) => (
    <Text testID={testID}>{number}</Text>
  );
});

describe("Timer Component", () => {
  beforeAll(() => {
    jest.useFakeTimers(); // Use Jest's fake timer functionality to control time progression
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

  it("renders the initial timer values correctly", () => {
    const endDate = new Date(Date.now() + 90061000); // 1 day, 1 hour, 1 minute, 1 second
    const { getByTestId } = render(
      <Timer endDate={endDate} onTimerFinished={jest.fn()} />,
    );

    expect(getByTestId("days").props.children).toBe(1); // Days
    expect(getByTestId("hours").props.children).toBe(1); // Hours
    expect(getByTestId("minutes").props.children).toBe(1); // Minutes
    expect(getByTestId("seconds").props.children).toBe(1); // Seconds
  });

  it("updates the timer values as time progresses", () => {
    const endDate = new Date(Date.now() + 10000); // 10 seconds from now
    const { getByTestId } = render(
      <Timer endDate={endDate} onTimerFinished={jest.fn()} />,
    );

    // Advance 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId("seconds").props.children).toBe(9); // 9 seconds remaining

    // Advance 9 more seconds
    act(() => {
      jest.advanceTimersByTime(9000);
    });

    expect(getByTestId("seconds").props.children).toBe(0); // Timer should reach 0 seconds
  });

  it("calls onTimerFinished when the timer ends", () => {
    const onTimerFinishedMock = jest.fn();
    const endDate = new Date(Date.now() + 3000); // 3 seconds from now

    render(<Timer endDate={endDate} onTimerFinished={onTimerFinishedMock} />);

    // Advance time to 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onTimerFinishedMock).toHaveBeenCalledTimes(1); // Verify the callback is called
  });

  it("clears the interval when unmounted", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const endDate = new Date(Date.now() + 10000); // 10 seconds from now

    const { unmount } = render(
      <Timer endDate={endDate} onTimerFinished={jest.fn()} />,
    );

    unmount(); // Unmount the component
    expect(clearIntervalSpy).toHaveBeenCalled(); // Ensure the interval is cleared
  });
});
