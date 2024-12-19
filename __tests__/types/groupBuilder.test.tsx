import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import * as SetFirestoreCtrl from "@/src/models/firebase/SetFirestoreCtrl";
import { createGroup } from "@/types/GroupBuilder";

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn().mockResolvedValue({
    uid: "user-123",
    name: "Test User",
  }),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  newGroup: jest.fn().mockResolvedValue({ name: "Test Group" }),
  addGroupToMemberGroups: jest.fn().mockResolvedValue({ name: "Test Group" }),
}));

describe("createGroup Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock methods with appropriate return values
  });

  it("creates a group successfully and assigns it to the user", async () => {
    const groupName = "Test Group";
    const challengeTitle = "Test Challenge";
    const members = ["member-1", "member-2"];
    const updateDate = new Date();
    const location = { latitude: 10, longitude: 20 };

    await createGroup(
      groupName,
      challengeTitle,
      members,
      updateDate,
      null,
      100,
    );

    expect(GetFirestoreCtrl.getUser).toHaveBeenCalledTimes(1);
    expect(SetFirestoreCtrl.newGroup).toHaveBeenCalledWith({
      name: groupName,
      challengeTitle: challengeTitle,
      members: members,
      updateDate: updateDate,
      location: null,
      radius: 100,
    });

    expect(SetFirestoreCtrl.addGroupToMemberGroups).toHaveBeenCalledWith(
      "user-123",
      groupName,
    );
  });

  it("handles errors when creating a group", async () => {
    jest
      .spyOn(GetFirestoreCtrl, "getUser")
      .mockRejectedValue(new Error("Error getting user"));

    const groupName = "Test Group";
    const challengeTitle = "Test Challenge";
    const members = ["member-1", "member-2"];
    const updateDate = new Date();

    await createGroup(
      groupName,
      challengeTitle,
      members,
      updateDate,
      null,
      100,
    );

    expect(GetFirestoreCtrl.getUser).toHaveBeenCalledTimes(1);
    expect(SetFirestoreCtrl.newGroup).not.toHaveBeenCalled();
  });
});
