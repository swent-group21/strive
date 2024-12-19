import { useState } from "react";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { logInWithEmail } from "@/types/Auth";

/**
 * ViewModel for the SignIn screen
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @param setUser : set user object
 * @returns : functions for the SignIn screen
 */
export default function SignInViewModel(
  navigation: any,
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
): {
  email: string;
  password: string;
  errorMessage: string | null;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleSignIn: () => Promise<void>;
} {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailChange = (text: string) => setEmail(text);

  const handlePasswordChange = (text: string) => setPassword(text);

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        setErrorMessage("Email and Password are required.");
        return;
      }

      await logInWithEmail(email, password, navigation, setUser);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage("Failed to sign in. Please try again.");
    }
  };

  return {
    email,
    password,
    errorMessage,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
  };
}
