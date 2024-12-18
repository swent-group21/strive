import React from "react";
import { render, act, renderHook } from "@testing-library/react-native";
import { Timer } from "@/src/views/components/challenge/timer";
import { useTimerViewModel } from "@/src/viewmodels/components/challenge/TimerViewModel";

// Test for the Timer ViewModel
describe("Timer ViewModel", () => {
  // Before each test, mock the console info and clear all mocks
  beforeEach(() => {
    jest.useFakeTimers(); // Use Jest's fake timer functionality to control time progression
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

  it("calculates the initial timer values correctly", () => {
    const { result } = renderHook(() =>
      useTimerViewModel({
        endDate: new Date(Date.now() + 90061000), // 1 day, 1 hour, 1 minute, 1 second from now
        onTimerFinished: jest.fn(),
      }),
    );

    expect(result.current.days).toBe(1); // Days
    expect(result.current.hours).toBe(1); // Hours
    expect(result.current.minutes).toBe(1); // Minutes
    expect(result.current.seconds).toBe(1); // Seconds
  });

  it("updates the timer values as time progresses", () => {
    const endDate = new Date(Date.now() + 10000); // 10 seconds from now

    const { result } = renderHook(() =>
      useTimerViewModel({
        endDate: endDate,
        onTimerFinished: jest.fn(),
      }),
    );

    // Advance 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(9); // 9 seconds remaining

    // Advance 9 more seconds
    act(() => {
      jest.advanceTimersByTime(9000);
    });

    expect(result.current.seconds).toBe(0); // Timer should reach 0 seconds
  });

  it("calls onTimerFinished when the timer ends", () => {
    const onTimerFinishedMock = jest.fn();
    const endDate = new Date(Date.now() + 3000); // 3 seconds from now

    const { result } = renderHook(() =>
      useTimerViewModel({
        endDate: endDate,
        onTimerFinished: onTimerFinishedMock,
      }),
    );

    // Advance time to 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onTimerFinishedMock).toHaveBeenCalledTimes(1); // Verify the callback is called
  });
});
