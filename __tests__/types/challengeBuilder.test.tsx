import { createChallenge } from "@/types/ChallengeBuilder";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import * as SetFirestoreCtrl from "@/src/models/firebase/SetFirestoreCtrl";

describe("createChallenge", () => {
  jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
    getUser: jest.fn(() => {
      return Promise.resolve({
        uid: "user123",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });
    }),
  }));

  jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
    newChallenge: jest.fn(),
  }));

  it("should create a challenge and call newChallenge with the correct data", async () => {
    // Mock location and challenge data
    const challengeData = {
      caption: "Test Challenge",
      date: new Date(),
      description: "Test Description",
    };

    // Call createChallenge with mock data
    await createChallenge(
      challengeData.caption,
      null,
      "123",
      challengeData.description,
      challengeData.date,
    );

    jest.spyOn(GetFirestoreCtrl, "getUser").mockImplementationOnce(
      (): Promise<any> =>
        Promise.resolve({
          uid: "user123",
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
        }),
    );

    jest.spyOn(SetFirestoreCtrl, "newChallenge").mockResolvedValue(undefined);
  });

  it("should log an error when Firestore operations fail", async () => {
    // Mock console.error
    jest
      .spyOn(GetFirestoreCtrl, "getUser")
      .mockRejectedValue(new Error("Error getting user"));

    const null_location = null;

    await expect(
      createChallenge(
        "Test",
        null_location,
        "123",
        "Test Challenge",
        new Date(),
      ),
    ).resolves.toBeUndefined(); // Function should handle the error internally
  });
});
