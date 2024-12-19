import { RootStackParamList } from "@/types/RootStackParamList"; // Make sure this path is correct
import { DBChallenge, DBGroup } from "@/src/models/firebase/TypeFirestoreCtrl";
import { GeoPoint } from "firebase/firestore";

// Mock GeoPoint
jest.mock("firebase/firestore", () => {
  return {
    GeoPoint: jest.fn().mockImplementation((lat, lng) => ({
      latitude: lat,
      longitude: lng,
      isEqual: (other) => lat === other.latitude && lng === other.longitude,
      toJSON: () => ({ latitude: lat, longitude: lng }),
    })),
  };
});

const mockChallenge: DBChallenge = {
  caption: "challengeName",
  challenge_id: "challenge123",
  uid: "user123",
  image_id: "https://example.com/image.jpg",
  likes: ["12345", "67890"],
  challenge_description: "challengeTitle",
  date: new Date(),
};

const mockGroup: DBGroup = {
  gid: "1234_5679",
  name: "Group Test 1",
  challengeTitle: "Challenge Test 1",
  members: ["James", "Rony"],
  updateDate: new Date(),
  location: new GeoPoint(43.6763, 7.0122),
  radius: 100,
};

const mockRootStackParamList: RootStackParamList = {
  Welcome: undefined,
  WelcomeFinal: undefined,
  SignUp: undefined,
  SignIn: undefined,
  ForgotPassword: undefined,
  SetUser: undefined,
  Home: undefined,
  Camera: {
    group_id: "hello",
  },
  SetUsername: undefined,
  Friends: undefined,
  Maximize: {
    challenge: mockChallenge,
  },
  Profile: undefined,
  MapScreen: undefined,
  GroupScreen: {
    currentGroup: mockGroup,
  },
  CreateGroup: undefined,
};

describe("RootStackParamList", () => {
  it("should have the correct properties and types", () => {
    expect(mockRootStackParamList).toHaveProperty("Welcome");
    expect(mockRootStackParamList.Welcome).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("WelcomeFinal");
    expect(mockRootStackParamList.WelcomeFinal).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("SignUp");
    expect(mockRootStackParamList.SignUp).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("SignIn");
    expect(mockRootStackParamList.SignIn).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("ForgotPassword");
    expect(mockRootStackParamList.ForgotPassword).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("SetUser");
    expect(mockRootStackParamList.SetUser).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("Home");
    expect(mockRootStackParamList.Home).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("Camera");
    expect(mockRootStackParamList.Camera).toEqual({ group_id: "hello" });

    expect(mockRootStackParamList).toHaveProperty("SetUsername");
    expect(mockRootStackParamList.SetUsername).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("Friends");
    expect(mockRootStackParamList.Friends).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("Maximize");
    expect(mockRootStackParamList.Maximize).toEqual({
      challenge: mockChallenge,
    });

    expect(mockRootStackParamList).toHaveProperty("Profile");
    expect(mockRootStackParamList.Profile).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("MapScreen");
    expect(mockRootStackParamList.MapScreen).toBeUndefined();

    expect(mockRootStackParamList).toHaveProperty("GroupScreen");
    expect(mockRootStackParamList.GroupScreen).toEqual({
      currentGroup: mockGroup,
    });

    expect(mockRootStackParamList).toHaveProperty("CreateGroup");
    expect(mockRootStackParamList.CreateGroup).toBeUndefined();
  });
});
