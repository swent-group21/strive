import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";
jest.mock("@/src/models/firebase/FirestoreCtrl");
import { createGroup } from "@/types/GroupBuilder";

describe("createGroup Function", () => {
  let firestoreCtrl;

  beforeEach(() => {
    firestoreCtrl = new FirestoreCtrl();

    jest.clearAllMocks();

    // Mock methods with appropriate return values
    firestoreCtrl.getUser = jest.fn().mockResolvedValue({
      uid: "user-123",
      name: "Test User",
    });

    firestoreCtrl.newGroup = jest
      .fn()
      .mockResolvedValue({ name: "Test Group" });
    firestoreCtrl.addGroupToUser = jest
      .fn()
      .mockResolvedValue({ name: "Test Group" });
  });

  it("creates a group successfully and assigns it to the user", async () => {
    const groupName = "Test Group";
    const challengeTitle = "Test Challenge";
    const members = ["member-1", "member-2"];
    const updateDate = new Date();
    const location = { latitude: 10, longitude: 20 };

    await createGroup(
      firestoreCtrl,
      groupName,
      challengeTitle,
      members,
      updateDate,
      null,
      100,
    );

    expect(firestoreCtrl.getUser).toHaveBeenCalledTimes(1);
    expect(firestoreCtrl.newGroup).toHaveBeenCalledWith({
      name: groupName,
      challengeTitle: challengeTitle,
      members: members,
      updateDate: updateDate,
      location: null,
      radius: 100,
    });
    expect(firestoreCtrl.addGroupToUser).toHaveBeenCalledWith(
      "user-123",
      groupName,
    );
  });

  it("handles errors when creating a group", async () => {
    const error = new Error("Failed to create group");
    firestoreCtrl.getUser.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const groupName = "Test Group";
    const challengeTitle = "Test Challenge";
    const members = ["member-1", "member-2"];
    const updateDate = new Date();

    await createGroup(
      firestoreCtrl,
      groupName,
      challengeTitle,
      members,
      updateDate,
      null,
      100,
    );

    expect(firestoreCtrl.getUser).toHaveBeenCalledTimes(1);
    expect(firestoreCtrl.newGroup).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error creating group: ", error);

    consoleSpy.mockRestore();
  });
});
