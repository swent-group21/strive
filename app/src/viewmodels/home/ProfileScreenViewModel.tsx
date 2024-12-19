import { useEffect, useState } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import { DBUser } from "../../models/firebase/TypeFirestoreCtrl";
import { logOut, resetEmail, resetPassword } from "@/types/Auth";
import { getProfilePicture } from "@/src/models/firebase/GetFirestoreCtrl";
import {
  setName,
  setProfilePicture,
} from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * ViewModel for the profile screen.
 * @param user : user object
 * @param setUser : set user object
 * @param navigation : navigation object
 * @returns : functions for the profile screen
 */
export function useProfileScreenViewModel(
  user: DBUser,
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  navigation: any,
): {
  userIsGuest: boolean;
  name: string;
  sName: React.Dispatch<React.SetStateAction<string>>;
  image: string | null;
  pickImage: () => Promise<void>;
  upload: () => Promise<void>;
  handleLogOut: () => Promise<void>;
  handleChangeEmail: () => Promise<void>;
  handleChangePassword: () => Promise<void>;
  navigateGoBack: () => void;
} {
  const userIsGuest = user.name === "Guest";

  const [name, sName] = useState<string>(user.name);
  const [image, setImage] = useState<string | null>(user.image_id ?? null);

  const navigateGoBack = () => navigation.goBack();

  // Fetch the user's profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const profilePicture = await getProfilePicture(user.uid);
      console.log("Profile picture: ", profilePicture);
      setImage(profilePicture || null);
    };
    fetchProfilePicture();
  }, [user.uid]);

  // Pick an image from the user's gallery
  const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // Upload the user's profile picture and name
  const upload = async () => {
    if (!name) {
      alert("Please enter a username.");
      return;
    }

    try {
      await setName(user.uid, name, setUser);
      if (image) {
        await setProfilePicture(user.uid, image, setUser);
        console.log("Image after setProfilePicture: ", image);
      }
    } catch (error) {
      console.error("Error changing profile: ", error);
      alert("Error changing profile: " + error);
    }
  };

  const handleLogOut = () => logOut(navigation);
  const handleChangeEmail = () => resetEmail(user.email);
  const handleChangePassword = () => resetPassword(user.email);

  return {
    userIsGuest,
    name,
    sName,
    image,
    pickImage,
    upload,
    handleLogOut,
    handleChangeEmail,
    handleChangePassword,
    navigateGoBack,
  };
}
