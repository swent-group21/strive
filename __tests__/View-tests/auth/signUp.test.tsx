import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SignUp from "@/src/views/auth/sign_up_screen";
import useSignUpViewModel from "@/src/viewmodels/auth/SignUpViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/auth/SignUpViewModel");

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    // Implement the FirestoreCtrl methods here
  }));
});

describe("SignUp Screen Tests", () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockSetUser = jest.fn();
  const mockFirestoreCtrl = new FirestoreCtrl();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSignUpViewModel as jest.Mock).mockReturnValue({
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      setName: jest.fn(),
      setSurname: jest.fn(),
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      setConfirmPassword: jest.fn(),
      handleSignUp: jest.fn(),
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmPasswordValid: true,
    });
  });

  it("renders all input fields and the Sign Up button", () => {
    const { getByTestId } = render(
      <SignUp
        navigation={mockNavigation}
        setUser={mockSetUser}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    expect(getByTestId("sign-up-screen")).toBeTruthy();
    expect(getByTestId("name-input")).toBeTruthy();
    expect(getByTestId("surname-input")).toBeTruthy();
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByTestId("confirm-password-input")).toBeTruthy();
    expect(getByTestId("sign-up-button")).toBeTruthy();
  });

  it("calls setName when the name input changes", () => {
    const mockSetName = jest.fn();
    (useSignUpViewModel as jest.Mock).mockReturnValue({
      ...useSignUpViewModel(mockNavigation, mockSetUser, mockFirestoreCtrl),
      setName: mockSetName,
    });

    const { getByTestId } = render(
      <SignUp
        navigation={mockNavigation}
        setUser={mockSetUser}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    const nameInput = getByTestId("name-input");
    fireEvent.changeText(nameInput, "John");

    expect(mockSetName).toHaveBeenCalledWith("John");
  });

  it("calls handleSignUp when the Sign Up button is pressed", () => {
    const mockHandleSignUp = jest.fn();
    (useSignUpViewModel as jest.Mock).mockReturnValue({
      ...useSignUpViewModel(mockNavigation, mockSetUser, mockFirestoreCtrl),
      handleSignUp: mockHandleSignUp,
    });

    const { getByTestId } = render(
      <SignUp
        navigation={mockNavigation}
        setUser={mockSetUser}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    const signUpButton = getByTestId("sign-up-button");
    fireEvent.press(signUpButton);

    expect(mockHandleSignUp).toHaveBeenCalled();
  });
});
