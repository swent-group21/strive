import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { UserListItem } from "@/components/friends/UserListItems";

describe("UserListItem", () => {
  const mockOnAdd = jest.fn();
  const mockOnCancelRequest = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default "ADD" status when not a friend or requested', () => {
    const { getByText } = render(
      <UserListItem
        name="John Doe"
        avatar={null}
        isFriend={false}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("ADD")).toBeTruthy();
    expect(getByText("John Doe")).toBeTruthy();
  });

  it('renders with "REQUESTED" status when a friend request is pending', () => {
    const { getByText } = render(
      <UserListItem
        name="Jane Smith"
        avatar={null}
        isFriend={false}
        isRequested={true}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("REQUESTED")).toBeTruthy();
    expect(getByText("Jane Smith")).toBeTruthy();
  });

  it('renders with "FRIEND" status when already a friend', () => {
    const { getByText } = render(
      <UserListItem
        name="Michael Johnson"
        avatar={null}
        isFriend={true}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("✓")).toBeTruthy();
    expect(getByText("Michael Johnson")).toBeTruthy();
  });

  it('calls onAdd when "ADD" button is pressed', () => {
    const { getByText, getByTestId } = render(
      <UserListItem
        name="John Doe"
        avatar={null}
        isFriend={false}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    const addButton = getByTestId("add-button-John Doe");
    fireEvent.press(addButton);

    expect(mockOnAdd).toHaveBeenCalled();
    expect(getByText("REQUESTED")).toBeTruthy();
  });

  it('calls onCancelRequest when "REQUESTED" button is pressed', () => {
    const { getByText, getByTestId } = render(
      <UserListItem
        name="Jane Smith"
        avatar={null}
        isFriend={false}
        isRequested={true}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    const cancelButton = getByTestId("add-button-Jane Smith");
    fireEvent.press(cancelButton);

    expect(mockOnCancelRequest).toHaveBeenCalled();
    expect(getByText("ADD")).toBeTruthy();
  });

  it("renders default avatar when no avatar is provided", () => {
    const { getByText } = render(
      <UserListItem
        name="Jane Smith"
        avatar={null}
        isFriend={false}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("J")).toBeTruthy();
  });
});
