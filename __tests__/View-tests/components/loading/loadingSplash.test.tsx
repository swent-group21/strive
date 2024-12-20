import React from "react";
import { render } from "@testing-library/react-native";
import { LoadingSplash } from "@/src/views/components/loading/loading_splash";

describe("LoadingSplash Component", () => {
  it("renders correct loading message", () => {
    const loadingText = "Loading some test";

    const { getByText } = render(<LoadingSplash loading_text={loadingText} />);

    expect(getByText(loadingText)).toBeTruthy();
  });

  it("renders an activity indicator", () => {
    const { getByTestId } = render(<LoadingSplash loading_text="" />);

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});
