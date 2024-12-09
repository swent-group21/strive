import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";
import { buildChallenge, createChallenge } from "@/types/ChallengeBuilder";

jest.mock("@/src/models/firebase/FirestoreCtrl");

describe("buildChallenge", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();

  it("should return a valid DBChallenge object when challenge is found", async () => {
    const mockChallenge = {
      challenge_name: "Test Challenge",
      description: "A test description",
      uid: "user123",
      date: new Date(),
      location: { latitude: 10, longitude: 20 },
    };

    mockFirestoreCtrl.getChallenge = jest.fn().mockResolvedValue(mockChallenge);

    const result = await buildChallenge("challenge123", mockFirestoreCtrl);

    expect(result).toEqual({
      challenge_name: "Test Challenge",
      description: "A test description",
      uid: "user123",
      date: mockChallenge.date,
      location: mockChallenge.location,
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
      challenge_name: "Test Challenge",
      description: "Test Description",
      date: new Date(),
    };

    // Call createChallenge with mock data
    await createChallenge(
      mockFirestoreCtrl,
      challengeData.challenge_name,
      challengeData.description,
      null,
      "123",
      challengeData.date,
    );

    // Verify FirestoreCtrl methods were called correctly
    expect(mockFirestoreCtrl.getUser).toHaveBeenCalled();
    expect(mockFirestoreCtrl.newChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        challenge_name: "Test Challenge",
        description: "Test Description",
        uid: "user123",
        date: challengeData.date,
        location: null,
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
        "Description",
        null_location,
        "123",
      ),
    ).resolves.toBeUndefined(); // Function should handle the error internally
  });
});
