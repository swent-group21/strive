import { useState } from "react";
import { resetPassword } from "@/types/Auth";

/**
 * ViewModel for the ForgotPassword screen
 * @returns : email, errorMessage, handleEmailChange, and handleResetPassword
 */
export default function ForgotPasswordViewModel(): {
  email: string;
  errorMessage: string | null;
  handleEmailChange: (text: string) => void;
  handleResetPassword: () => Promise<void>;
} {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailChange = (text: string) => setEmail(text);

  // Reset the user's password
  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    try {
      await resetPassword(email);
      alert("A reset password link has been sent to your email.");
    } catch (error) {
      console.error("Error resetting password: ", error);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return {
    email,
    errorMessage,
    handleEmailChange,
    handleResetPassword,
  };
}
