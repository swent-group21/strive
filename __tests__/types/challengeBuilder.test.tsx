import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";
import { buildChallenge, createChallenge } from "@/types/ChallengeBuilder";

jest.mock("@/src/models/firebase/FirestoreCtrl");

describe("buildChallenge", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();

  it("should return a valid DBChallenge object when challenge is found", async () => {
    const mockChallenge = {
      caption: "Test Challenge",
      uid: "user123",
      date: new Date(),
      location: { latitude: 10, longitude: 20 },
      group_id: "home",
      challenge_description: "Test description",
    };

    mockFirestoreCtrl.getChallenge = jest.fn().mockResolvedValue(mockChallenge);

    const result = await buildChallenge("challenge123", mockFirestoreCtrl);

    expect(result).toEqual({
      caption: "Test Challenge",
      uid: "user123",
      date: mockChallenge.date,
      location: mockChallenge.location,
      group_id: "home",
      challenge_description: "Test description",
    });
    expect(mockFirestoreCtrl.getChallenge).toHaveBeenCalledWith("challenge123");
  });

  it("should throw an error if no challenge is found", async () => {
    mockFirestoreCtrl.getChallenge = jest
      .fn()
      .mockResolvedValue(new Error("No challenge found"));

    try {
      await buildChallenge("invalidChallenge", mockFirestoreCtrl);
    } catch (error) {
      expect(error).toEqual("Error: no challenge found when buildChallenge");
    }
  });
});

describe("createChallenge", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();

  it("should create a challenge and call newChallenge with the correct data", async () => {
    const mockUser = { uid: "user123" }; // Mock user data

    // Mock FirestoreCtrl methods
    mockFirestoreCtrl.getUser = jest.fn().mockResolvedValue(mockUser);
    mockFirestoreCtrl.newChallenge = jest.fn();

    // Mock location and challenge data
    const challengeData = {
      caption: "Test Challenge",
      date: new Date(),
      description: "Test Description",
    };

    // Call createChallenge with mock data
    await createChallenge(
      mockFirestoreCtrl,
      challengeData.caption,
      null,
      "123",
      challengeData.description,
      challengeData.date,
    );

    // Verify FirestoreCtrl methods were called correctly
    expect(mockFirestoreCtrl.getUser).toHaveBeenCalled();
    expect(mockFirestoreCtrl.newChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        caption: "Test Challenge",
        uid: "user123",
        date: challengeData.date,
        location: null,
        challenge_description: "Test Description",
      }),
    );
  });

  it("should log an error when Firestore operations fail", async () => {
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockFirestoreCtrl.getUser = jest
      .fn()
      .mockRejectedValue(new Error("Firestore error"));

    const null_location = null;

    await expect(
      createChallenge(
        mockFirestoreCtrl,
        "Test",
        null_location,
        "123",
        "Test Challenge",
        new Date(),
      ),
    ).resolves.toBeUndefined(); // Function should handle the error internally
  });
});
