import FirestoreCtrl, {
  DBGroup,
  DBUser,
} from "@/src/models/firebase/FirestoreCtrl";

/**
 * Used to create a Group and store it in Firestore DB
 */
export const createGroup = async (
  firestoreCtrl: FirestoreCtrl,
  name: string,
  challengeTitle: string,
  members: string[],
  updateDate: Date,
): Promise<void> => {
  try {
    // Prepare the challenge data for Firestore
    const user: DBUser = await firestoreCtrl.getUser();
    console.log("createGroup uid", user.uid);

    const newGroup: DBGroup = {
      name: name,
      challengeTitle: challengeTitle,
      members: members,
      updateDate: updateDate,
    };

    // Save the group to Firestore
    await firestoreCtrl.newGroup(newGroup);
    await firestoreCtrl.addGroupToMemberGroups(user.uid, newGroup.name);
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};
