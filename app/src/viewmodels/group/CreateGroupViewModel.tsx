import { useState } from "react";
import { createGroup } from "@/types/GroupBuilder";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

export default function CreateGroupViewModel({
  user,
  navigation,
  firestoreCtrl,
}: {
  user: DBUser;
  navigation: any;
  firestoreCtrl: FirestoreCtrl;
}) {
  const [groupName, setGroupName] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");

  // Create the challenge
  const makeGroup = async () => {
    try {
      const creationDate = new Date();
      const members = [user.uid];

      await createGroup(
        firestoreCtrl,
        groupName,
        challengeTitle,
        members,
        creationDate,
      );

      navigation.navigate("Home");
    } catch (error) {
      console.error("Unable to create challenge", error);
      return error;
    }
  };

  return {
    groupName,
    setGroupName,
    challengeTitle,
    setChallengeTitle,
    makeGroup,
  };
}
