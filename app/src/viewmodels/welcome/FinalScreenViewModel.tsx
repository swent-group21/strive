import { signInAsGuest } from "@/types/Auth";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";

/**
 * ViewModel for the WelcomeFinal screen
 * @param navigation : navigation object
 * @param setUser : set user object
 * @returns : functions for the WelcomeFinal screen
 */
export default function WelcomeFinalViewModel({
  navigation,
  setUser,
}: {
  navigation: any;
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
}) {
  const navigateToSignIn = () => navigation.navigate("SignIn");

  const navigateToSignUp = () => navigation.navigate("SignUp");

  const continueAsGuest = async () => {
    try {
      await signInAsGuest(navigation, setUser);
    } catch (error) {
      console.error("Error signing in as guest: ", error);
      alert("Failed to continue as guest.");
    }
  };

  return {
    navigateToSignIn,
    navigateToSignUp,
    continueAsGuest,
  };
}
