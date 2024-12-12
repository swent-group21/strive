import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

/**
 * ViewModel for the SetUsername screen.
 * @param user : user object
 * @param firestoreCtrl : FirestoreCtrl object
 * @param setUser : set user object
 * @returns : functions for the SetUsername screen
 */
export default function SetUsernameViewModel(
  user: DBUser,
  firestoreCtrl: FirestoreCtrl,
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
): {
  username: string;
  image: string | null;
  errorMessage: string | null;
  handleUsernameChange: (text: string) => void;
  pickImage: () => Promise<void>;
  upload: () => Promise<void>;
} {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUsernameChange = (text: string) => setUsername(text);

  // Pick an image from the user's gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
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
      setErrorMessage("Failed to pick image.");
    }
  };

  // Upload the user's profile picture
  const upload = async () => {
    if (!username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }

    try {
      if (image) {
        await firestoreCtrl.setProfilePicture(user.uid, image, setUser);
      }
      await firestoreCtrl.setName(user.uid, username, setUser);
    } catch (error) {
      console.error("Error setting up profile: ", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  return {
    username,
    image,
    errorMessage,
    handleUsernameChange,
    pickImage,
    upload,
  };
}
