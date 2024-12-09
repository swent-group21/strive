import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "@/components/friends/Search_Bar";

describe("SearchBar", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />);

    const searchInput = getByPlaceholderText("Search for a user...");
    expect(searchInput).toBeTruthy();
  });

  it("calls onSearch when text is entered", () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} />,
    );

    const searchInput = getByPlaceholderText("Search for a user...");

    fireEvent.changeText(searchInput, "John");

    expect(mockOnSearch).toHaveBeenCalledWith("John");
  });

  it("handles empty input correctly", () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} />,
    );

    const searchInput = getByPlaceholderText("Search for a user...");

    fireEvent.changeText(searchInput, "");

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});
