import React from "react";
import { render, act } from "@testing-library/react-native";
import { Timer } from "@/src/views/components/challenge/timer";

// Mock the NumberCard component to isolate Timer logic
jest.mock("@/src/views/components/challenge/number_cards", () => {
  const { Text } = require("react-native");
  return ({ number, testID }: { number: number; testID: string }) => (
    <Text testID={testID}>{number}</Text>
  );
});

// Mock du ViewModel
jest.mock("@/src/viewmodels/components/challenge/TimerViewModel", () => ({
  useTimerViewModel: jest.fn(),
}));

describe("Timer Component", () => {
  const mockUseTimerViewModel =
    require("@/src/viewmodels/components/challenge/TimerViewModel").useTimerViewModel;

  beforeAll(() => {
    jest.useFakeTimers(); // Use Jest's fake timer functionality to control time progression
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

  it("renders the timer component", () => {
    mockUseTimerViewModel.mockReturnValue({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });

    const endDate = new Date();

    const { getByTestId } = render(
      <Timer
        endDate={endDate}
        onTimerFinished={jest.fn()}
        testID={"timer-test-id"}
      />,
    );

    expect(getByTestId("timer-test-id")).toBeTruthy();
  });

  it("renders the initial timer values correctly", () => {
    mockUseTimerViewModel.mockReturnValue({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });

    const endDate = new Date(Date.now() + 90061000); // 1 day, 1 hour, 1 minute, 1 second

    const { getByTestId } = render(
      <Timer endDate={endDate} onTimerFinished={jest.fn()} />,
    );

    // Check if the timer values are rendered correctly
    expect(getByTestId("days").props.children).toBe(1); // Days
    expect(getByTestId("hours").props.children).toBe(1); // Hours
    expect(getByTestId("minutes").props.children).toBe(1); // Minutes
    expect(getByTestId("seconds").props.children).toBe(1); // Seconds
  });
});
