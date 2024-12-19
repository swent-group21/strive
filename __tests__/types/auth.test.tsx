import {
  isValidEmail,
  logInWithEmail,
  signUpWithEmail,
  signInAsGuest,
  logOut,
  resetPassword,
  resetEmail,
} from "@/types/Auth";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
} from "@/src/models/firebase/Firebase";
import { getUser } from "@/src/models/firebase/GetFirestoreCtrl";

jest.mock("@/src/models/firebase/Firebase", () => ({
  auth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateEmail: jest.fn(),
}));
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { createUser } from "@/src/models/firebase/SetFirestoreCtrl";

jest.unmock("@/types/Auth");
describe("isValidEmail", () => {
  it("should return true for valid email addresses", () => {
    const validEmails = [
      "test@example.com",
      "user.name@example.com",
      "user-name@example.co.uk",
      "user123@example.io",
      "user@example.museum",
    ];

    validEmails.forEach((email) => {
      const result = isValidEmail(email);
      expect(result).toBe(true);
    });
  });

  it("should return false for invalid email addresses", () => {
    const invalidEmails = [
      "plainaddress",
      "@missingusername.com",
      "username@.com",
      "username@com",
      "username@.com.",
      "username@com..com",
      "username@@example.com",
      "username@ example.com",
      "username@example..com",
    ];

    invalidEmails.forEach((email) => {
      const result = isValidEmail(email);
      expect(result).toBe(false);
    });
  });

  it("should return false for empty or null input", () => {
    const emptyInputs = [
      "",
      null as unknown as string,
      undefined as unknown as string,
    ];

    emptyInputs.forEach((input) => {
      const result = isValidEmail(input);
      expect(result).toBe(false);
    });
  });
});

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn((uid: string) => {
    if (uid === "user123") {
      return Promise.resolve({
        uid: "user123",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });
    }
    return Promise.reject(new Error("User not found"));
  }),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  createUser: jest.fn((uid: string, user: DBUser) => {
    if (uid === "user" || uid === "guest123") {
      return Promise.resolve();
    }
    return Promise.reject(new Error("User not found"));
  }),
}));

describe("logInWithEmail", () => {
  // Mock navigation
  const mockNavigation = {
    reset: jest.fn(),
    navigate: jest.fn(),
  };

  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    global.alert = jest.fn(); // Mock alert function
  });

  it("should log in with valid credentials and set the user", async () => {
    // Mock Firebase Auth response
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      },
    });

    // Mock Firestore response
    getUser("user123");

    // Call the function
    await logInWithEmail(
      "test@example.com",
      "password123",
      mockNavigation,
      setUser,
    );

    // Assertions
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
    expect(getUser).toHaveBeenCalledWith("user123");
    expect(setUser).toHaveBeenCalledWith({
      uid: "user123",
      name: "Test User",
      email: "test@example.com",
      createdAt: expect.any(Date),
    });
    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: "Home",
          params: {
            user: {
              uid: "user123",
              name: "Test User",
              email: "test@example.com",
              createdAt: expect.any(Date),
            },
          },
        },
      ],
    });
  });

  it("should create a new user in Firestore if not found", async () => {
    // Mock Firebase Auth response
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "user",
        email: "test@example.com",
      },
    });

    // Call the function
    await logInWithEmail(
      "test@example.com",
      "password123",
      mockNavigation,
      setUser,
    );

    // Assertions
    expect(createUser).toHaveBeenCalledWith("user", {
      uid: "user",
      name: "",
      email: "test@example.com",
      createdAt: expect.any(Date),
      groups: [],
    });
  });

  it("should handle login failure due to invalid credentials", async () => {
    // Temporarily suppress console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock Firebase Auth rejection
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    // Call the function
    await logInWithEmail(
      "test@example.com",
      "wrongpassword",
      mockNavigation,
      setUser,
    );

    // Assertions
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "wrongpassword",
    );
    expect(getUser).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
    // No navigation reset or navigate should occur
    expect(mockNavigation.reset).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    // Restore the original console.error
    console.error = originalConsoleError;
  });

  it("should alert and log error if login fails unexpectedly", async () => {
    // Mock alert and console.error
    jest.spyOn(global, "alert").mockImplementation(() => {});
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock Firebase Auth rejection
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    // Call the function
    await logInWithEmail(
      "test@example.com",
      "password123",
      mockNavigation,
      setUser,
    );

    // Assertions
    expect(alert).toHaveBeenCalledWith(
      "Failed to log in: Error: Network Error",
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to log in: ",
      new Error("Network Error"),
    );
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
  });
});

describe("signUpWithEmail", () => {
  // Mock navigation
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    global.alert = jest.fn(); // Mock alert function
  });

  it("should successfully create a user in Firebase Auth and Firestore", async () => {
    // Mock Firebase Auth response
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "user",
      },
    });

    // Call the function
    await signUpWithEmail(
      "Test User",
      "test@example.com",
      "password123",
      mockNavigation,
      mockSetUser,
    );

    // Assertions
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
    expect(createUser).toHaveBeenCalledWith("user", {
      uid: "user",
      name: "Test User",
      email: "test@example.com",
      createdAt: expect.any(Date),
      groups: [],
    });
  });

  it("should handle errors when creating a user in Firestore", async () => {
    // Mock alert and console.error
    jest.spyOn(global, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock Firebase Auth response
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "user",
      },
    });

    // Call the function
    await signUpWithEmail(
      "Test User",
      "test@example.com",
      "password123",
      mockNavigation,
      mockSetUser,
    );

    // Assertions
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
    expect(createUser).toHaveBeenCalledWith("user", {
      uid: "user",
      name: "Test User",
      email: "test@example.com",
      createdAt: expect.any(Date),
      groups: [],
    });

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it("should handle errors when creating a user in Firebase Auth", async () => {
    // Mock Firebase Auth failure
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Firebase error"),
    );

    // Call the function
    await signUpWithEmail(
      "Test User",
      "test@example.com",
      "password123",
      mockNavigation,
      mockSetUser,
    );

    // Assertions
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
    expect(createUser).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it("should alert if required fields are missing", async () => {
    // Call the function with missing userName
    await signUpWithEmail(
      "",
      "test@example.com",
      "password123",
      mockNavigation,
      mockSetUser,
    );

    // Assertions
    expect(global.alert).toHaveBeenCalledWith("Please fill in all fields.");
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});

describe("signInAsGuest", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  it("should successfully sign in as a guest and create a Firestore user", async () => {
    // Mock Firebase response
    (signInAnonymously as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "guest123",
      },
    });

    // Call the function
    await signInAsGuest(mockNavigation, mockSetUser);

    // Assertions
    expect(signInAnonymously).toHaveBeenCalledWith(auth);
    expect(createUser).toHaveBeenCalledWith("guest123", {
      uid: "guest123",
      name: "Guest",
      email: "",
      createdAt: expect.any(Date),
    });
  });

  it("should handle Firestore user creation failure", async () => {
    // Mock Firebase response
    (signInAnonymously as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: "guest123",
      },
    });

    // Call the function
    await signInAsGuest(mockNavigation, mockSetUser);

    // Assertions
    expect(signInAnonymously).toHaveBeenCalledWith(auth);
    expect(createUser).toHaveBeenCalledWith("guest123", {
      uid: "guest123",
      name: "Guest",
      email: "",
      createdAt: expect.any(Date),
    });
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it("should handle guest sign-in failure", async () => {
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock Firebase sign-in failure
    (signInAnonymously as jest.Mock).mockRejectedValueOnce(
      new Error("Firebase error"),
    );

    // Call the function
    await signInAsGuest(mockNavigation, mockSetUser);

    // Assertions
    expect(signInAnonymously).toHaveBeenCalledWith(auth);
    expect(createUser).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});

describe("logOut", () => {
  const mockNavigation = {
    reset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mock alert
    console.error = jest.fn(); // Mock console.error
  });

  it("should log out and reset navigation to WelcomeFinal screen", async () => {
    // Mock successful signOut
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    // Call the function
    await logOut(mockNavigation);

    // Assertions
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: "WelcomeFinal" }],
    });
    expect(global.alert).not.toHaveBeenCalled(); // No alert should be shown
    expect(console.error).not.toHaveBeenCalled(); // No error logged
  });

  it("should handle logout failure and alert the user", async () => {
    // Mock signOut rejection
    (signOut as jest.Mock).mockRejectedValueOnce(new Error("Logout error"));

    // Call the function
    await logOut(mockNavigation);

    // Assertions
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(mockNavigation.reset).not.toHaveBeenCalled(); // Navigation should not reset
  });
});

describe("resetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mock alert
    console.error = jest.fn(); // Mock console.error
  });

  it("should send a password reset email when a valid email is provided", async () => {
    // Mock sendPasswordResetEmail success
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

    // Call the function
    await resetPassword("test@example.com");

    // Assertions
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      auth,
      "test@example.com",
    );
    expect(global.alert).toHaveBeenCalledWith("Password reset email sent.");
    expect(console.error).not.toHaveBeenCalled(); // No error should be logged
  });

  it("should alert and log error if sending the email fails", async () => {
    // Mock sendPasswordResetEmail failure
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Email send error"),
    );

    // Call the function
    await resetPassword("test@example.com");

    // Assertions
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      auth,
      "test@example.com",
    );
  });

  it("should alert and log error if no email is provided", async () => {
    // Call the function with an empty email
    await resetPassword("");

    // Assertions
    expect(sendPasswordResetEmail).not.toHaveBeenCalled(); // Email sending should not be attempted
    expect(global.alert).toHaveBeenCalledWith("Please enter your email.");
    expect(console.error).toHaveBeenCalledWith("Please enter your email.");
  });
});

describe("resetEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mock alert
    console.error = jest.fn(); // Mock console.error
  });

  it("should successfully update the email if valid and user is signed in", async () => {
    // Mock current user
    (auth.currentUser as any) = { uid: "user123" };

    // Mock email update success
    (updateEmail as jest.Mock).mockResolvedValueOnce(undefined);

    // Call the function
    await resetEmail("new@example.com");

    // Assertions
    expect(updateEmail).toHaveBeenCalledWith(
      auth.currentUser,
      "new@example.com",
    );
    expect(global.alert).toHaveBeenCalledWith("Email updated.");
    expect(console.error).not.toHaveBeenCalled(); // No error should be logged
  });

  it("should alert and log an error if the email is invalid", async () => {
    // Call the function
    await resetEmail("invalid-email");

    // Assertions
    expect(updateEmail).not.toHaveBeenCalled(); // Email update should not be attempted
    expect(global.alert).toHaveBeenCalledWith("Please enter a valid email.");
    expect(console.error).toHaveBeenCalledWith("Please enter a valid email.");
  });

  it("should alert and log an error if no email is provided", async () => {
    // Call the function with an empty email
    await resetEmail("");

    // Assertions
    expect(updateEmail).not.toHaveBeenCalled(); // Email update should not be attempted
    expect(global.alert).toHaveBeenCalledWith("Please enter your email.");
    expect(console.error).toHaveBeenCalledWith("Please enter your email.");
  });

  it("should alert and log an error if no user is signed in", async () => {
    // Mock email validation and remove current user
    (auth.currentUser as any) = null;

    // Call the function
    await resetEmail("new@example.com");

    // Assertions
    expect(updateEmail).not.toHaveBeenCalled(); // Email update should not be attempted
    expect(global.alert).toHaveBeenCalledWith(
      "No user is currently signed in.",
    );
    expect(console.error).toHaveBeenCalledWith(
      "No user is currently signed in.",
    );
  });
});
