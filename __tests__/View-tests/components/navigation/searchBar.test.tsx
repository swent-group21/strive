import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "@/src/views/components/navigation/search_bar";

describe("SearchBar", () => {
  it("renders correctly with the correct element to search", () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={() => {}} element={"testElement"} />,
    );

    // The displayed text should include the element passed
    const searchInput = getByPlaceholderText("Search for a testElement...");
    expect(searchInput).toBeTruthy();
  });

  it("calls onSearch when text is entered", () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} element={"user"} />,
    );

    const searchInput = getByPlaceholderText("Search for a user...");

    fireEvent.changeText(searchInput, "John");

    expect(mockOnSearch).toHaveBeenCalledWith("John");
  });

  it("handles empty input correctly", () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} element={"user"} />,
    );

    const searchInput = getByPlaceholderText("Search for a user...");

    fireEvent.changeText(searchInput, "");

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});
