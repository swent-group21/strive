import { jest } from "@jest/globals";
import { GeoPoint } from "firebase/firestore";
import * as LocalStorageCtrl from "@/src/models/firebase/LocalStorageCtrl";
import * as TypeFirestoreCtrl from "@/src/models/firebase/TypeFirestoreCtrl";
import * as SetFirestoreCtrl from "@/src/models/firebase/SetFirestoreCtrl";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";

import {
  setUploadTaskScheduled,
  getUploadTaskScheduled,
  backgroundTask,
  scheduleUploadTask,
  getStoredImageUploads,
  getStoredChallenges,
  getStoredGroups,
} from "@/src/models/firebase/LocalStorageCtrl";

// Mock the imported dependencies
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true }),
  ),
}));

jest.mock("expo-file-system", () => ({
  cacheDirectory: "file://mockCacheDirectory/",
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve()),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  uploadImage: jest.fn(() => Promise.resolve()),
  newChallenge: jest.fn(() => Promise.resolve()),
  newGroup: jest.fn(() => Promise.resolve()),
  newComment: jest.fn(() => Promise.resolve()),
  updateGroup: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn(() =>
    Promise.resolve({
      uid: "mockUserId",
      name: "Mock User",
      email: "mock@example.com",
      createdAt: new Date(8.64e15),
    }),
  ),
}));

jest.mock("@/src/models/firebase/Firebase", () => ({
  GeoPoint: jest.fn().mockImplementation((lat, lng) => ({
    latitude: lat,
    longitude: lng,
    isEqual: (other) => lat === other.latitude && lng === other.longitude,
    toJSON: () => ({ latitude: lat, longitude: lng }),
  })),
}));

// Import types
import {
  DBChallenge,
  DBGroup,
  DBComment,
} from "@/src/models/firebase/TypeFirestoreCtrl";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("LocalStorageCtrl", () => {
  describe("uploadTaskScheduled tests", () => {
    beforeEach(async () => {
      // Reset uploadTaskScheduled to false before each test
      await setUploadTaskScheduled(false);
    });

    test("getUploadTaskScheduled should return false by default", async () => {
      const result = await getUploadTaskScheduled();
      expect(result).toBe(false);
    });

    test("setUploadTaskScheduled should correctly set and get the value", async () => {
      await setUploadTaskScheduled(true);
      let result = await getUploadTaskScheduled();
      expect(result).toBe(true);

      await setUploadTaskScheduled(false);
      result = await getUploadTaskScheduled();
      expect(result).toBe(false);
    });
  });

  describe("getStoredImageUploads", () => {
    it("should retrieve stored image uploads", async () => {
      const mockData = [{ id: "image1", uri: "file://image1.jpg" }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData),
      );

      const result = await getStoredImageUploads();
      expect(result).toEqual(mockData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@images");
    });

    it("should return empty array if no data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await getStoredImageUploads();
      expect(result).toEqual([]);
    });
  });

  describe("getStoredChallenges", () => {
    it("should retrieve stored challenges", async () => {
      const mockChallenge: DBChallenge = {
        challenge_id: "challenge1",
        caption: "Test Caption",
        uid: "user1",
        challenge_description: "Test Description",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockChallenge]),
      );

      const result = await getStoredChallenges();
      expect(result).toEqual([mockChallenge]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@challenges");
    });

    it("should return empty array if no data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await getStoredChallenges();
      expect(result).toEqual([]);
    });
  });

  const GROUP_STORAGE_KEY = "@groups";

  describe("getStoredGroups", () => {
    it("should return an array of DBGroup objects when data is stored", async () => {
      const mockGroups = [
        {
          gid: "group1",
          name: "Group One",
          challengeTitle: "Challenge A",
          members: ["user1", "user2"],
          updateDate: new Date("2023-10-10"),
          location: { latitude: 40.7128, longitude: -74.006 },
          radius: 10,
        },
      ];

      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockGroups));

      const result = await getStoredGroups();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(GROUP_STORAGE_KEY);
      expect(result).toEqual([
        {
          gid: "group1",
          name: "Group One",
          challengeTitle: "Challenge A",
          members: ["user1", "user2"],
          updateDate: "2023-10-10T00:00:00.000Z",
          location: { latitude: 40.7128, longitude: -74.006 },
          radius: 10,
        },
      ]);
    });

    it("should return an empty array when no data is stored", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await getStoredGroups();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(GROUP_STORAGE_KEY);
      expect(result).toEqual([]);
    });
  });

  describe("getStoredComments", () => {
    it("should retrieve stored comments", async () => {
      const mockComment: DBComment = {
        comment_text: "Test Comment",
        user_name: "Test User",
        created_at: new Date(8.64e15),
        post_id: "post1",
        uid: "user1",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockComment]),
      );

      const result = await LocalStorageCtrl.getStoredComments();
      expect(result).toEqual([
        {
          comment_text: "Test Comment",
          user_name: "Test User",
          created_at: "+275760-09-13T00:00:00.000Z",
          post_id: "post1",
          uid: "user1",
        },
      ]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@comment");
    });

    it("should return empty array if no data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await LocalStorageCtrl.getStoredComments();
      expect(result).toEqual([]);
    });
  });

  describe("storeImageLocally", () => {
    it("should store image upload data in AsyncStorage", async () => {
      const id_picture = "image1";
      const localUri = `${FileSystem.cacheDirectory}${id_picture}`;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.storeImageLocally(id_picture);

      const expectedData = [{ id: id_picture, uri: localUri }];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@images",
        JSON.stringify(expectedData),
      );
    });

    it("should append to existing stored images", async () => {
      const id_picture = "image2";
      const localUri = `${FileSystem.cacheDirectory}${id_picture}`;
      const existingData = [{ id: "image1", uri: "file://image1.jpg" }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(existingData),
      );

      await LocalStorageCtrl.storeImageLocally(id_picture);

      const expectedData = [...existingData, { id: id_picture, uri: localUri }];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@images",
        JSON.stringify(expectedData),
      );
    });

    it("should handle errors when storing image", async () => {
      const error = new Error("AsyncStorage error");
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await LocalStorageCtrl.storeImageLocally("image1");
      expect(console.error).toHaveBeenCalledWith(
        "Error storing image upload data:",
        error,
      );
    });
  });

  describe("storeChallengeLocally", () => {
    it("should store challenge data in AsyncStorage", async () => {
      const mockChallenge: DBChallenge = {
        challenge_id: "challenge1",
        caption: "Test Caption",
        uid: "user1",
        challenge_description: "Test Description",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.storeChallengeLocally(mockChallenge);

      const expectedData = [mockChallenge];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@challenges",
        JSON.stringify(expectedData),
      );
    });
  });

  describe("storeCommentLocally", () => {
    it("should store comment data in AsyncStorage", async () => {
      const mockComment: DBComment = {
        comment_text: "Test Comment",
        user_name: "Test User",
        created_at: new Date(8.64e15),
        post_id: "post1",
        uid: "user1",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.storeCommentLocally(mockComment);

      const expectedData = [mockComment];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@comment",
        JSON.stringify(expectedData),
      );
    });
  });

  describe("uploadStoredImages", () => {
    it("should upload stored images and clear them from AsyncStorage", async () => {
      const mockUploads = [{ id: "image1", uri: "file://image1.jpg" }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUploads),
      );
      (SetFirestoreCtrl.uploadImage as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await LocalStorageCtrl.uploadStoredImages();

      expect(SetFirestoreCtrl.uploadImage).toHaveBeenCalledWith(
        undefined,
        "image1",
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@images",
        JSON.stringify([]),
      );
      expect(console.log).toHaveBeenCalledWith(
        "Local images uploaded and cleared",
      );
    });

    it("should handle errors when uploading images", async () => {
      const error = new Error("Upload error");
      const mockUploads = [{ id: "image1", uri: "file://image1.jpg" }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUploads),
      );
      (SetFirestoreCtrl.uploadImage as jest.Mock).mockRejectedValueOnce(error);

      await LocalStorageCtrl.uploadStoredImages();

      expect(console.error).toHaveBeenCalledWith(
        "Error uploading stored image:",
        error,
        mockUploads[0],
      );
    });

    it("should do nothing if there are no images to upload", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.uploadStoredImages();

      expect(console.log).toHaveBeenCalledWith("No stored images to upload.");
      expect(SetFirestoreCtrl.uploadImage).not.toHaveBeenCalled();
    });
  });

  describe("uploadStoredChallenges", () => {
    it("should upload stored challenges and clear them from AsyncStorage", async () => {
      const mockChallenge: DBChallenge = {
        challenge_id: "challenge1",
        caption: "Test Caption",
        uid: "user1",
        challenge_description: "Test Description",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockChallenge]),
      );
      (SetFirestoreCtrl.newChallenge as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await LocalStorageCtrl.uploadStoredChallenges();

      expect(SetFirestoreCtrl.newChallenge).toHaveBeenCalledWith(mockChallenge);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@challenges",
        JSON.stringify([]),
      );
      expect(console.log).toHaveBeenCalledWith(
        "Local challenges uploaded and cleared",
      );
    });

    it("should handle errors when uploading challenges", async () => {
      const error = new Error("Upload error");
      const mockChallenge: DBChallenge = {
        challenge_id: "challenge1",
        caption: "Test Caption",
        uid: "user1",
        challenge_description: "Test Description",
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockChallenge]),
      );
      (SetFirestoreCtrl.newChallenge as jest.Mock).mockRejectedValueOnce(error);

      await LocalStorageCtrl.uploadStoredChallenges();

      expect(console.error).toHaveBeenCalledWith(
        "Error uploading stored challenge:",
        error,
        mockChallenge,
      );
    });

    it("should do nothing if there are no challenges to upload", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.uploadStoredChallenges();

      expect(console.log).toHaveBeenCalledWith(
        "No stored challenges to upload.",
      );
      expect(SetFirestoreCtrl.newChallenge).not.toHaveBeenCalled();
    });
  });

  describe("uploadStoredGroups", () => {
    it("should upload stored groups and clear them from AsyncStorage", async () => {
      const mockGroup: DBGroup = {
        gid: "group1",
        name: "Test Group",
        challengeTitle: "Test Challenge",
        members: ["user1"],
        updateDate: new Date(8.64e15),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 10,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockGroup]),
      );
      (SetFirestoreCtrl.newGroup as jest.Mock).mockResolvedValueOnce(undefined);

      await LocalStorageCtrl.uploadStoredGroups();

      expect(SetFirestoreCtrl.newGroup).toHaveBeenCalledWith({
        gid: "group1",
        name: "Test Group",
        challengeTitle: "Test Challenge",
        members: ["user1"],
        updateDate: "+275760-09-13T00:00:00.000Z",
        location: { latitude: 43.6763, longitude: 7.0122 },
        radius: 10,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@groups",
        JSON.stringify([]),
      );
      expect(console.log).toHaveBeenCalledWith(
        "Local groups uploaded and cleared",
      );
    });

    it("should do nothing if there are no groups to upload", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await LocalStorageCtrl.uploadStoredGroups();

      expect(console.log).toHaveBeenCalledWith("No stored groups to upload.");
      expect(SetFirestoreCtrl.newGroup).not.toHaveBeenCalled();
    });
  });
});
