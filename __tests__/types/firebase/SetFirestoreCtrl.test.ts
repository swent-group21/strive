import { jest } from "@jest/globals";
import { GeoPoint } from "firebase/firestore";
import * as Firebase from "@/src/models/firebase/Firebase";
import * as NetInfo from "@react-native-community/netinfo";
import * as SetFirestoreCtrl from "@/src/models/firebase/SetFirestoreCtrl";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import * as LocalStorageCtrl from "@/src/models/firebase/LocalStorageCtrl";

import {
  createUser,
  uploadImage,
  setName,
  setProfilePicture,
  newChallenge,
  newGroup,
  updateGroup,
  addGroupToMemberGroups,
  appendComment,
  updateLikesOf,
  addFriend,
  acceptFriend,
  rejectFriend,
  removeFriendRequest,
} from "@/src/models/firebase/SetFirestoreCtrl";

import {
  storeChallengeLocally,
  storeGroupLocally,
  storeCommentLocally,
  storeImageLocally,
  setUploadTaskScheduled,
  getUploadTaskScheduled,
} from "@/src/models/firebase/LocalStorageCtrl";

// Mock the imported dependencies
jest.mock("@/src/models/firebase/Firebase", () => ({
  firestore: {},
  doc: jest.fn(() => ({})),
  addDoc: jest.fn(() => Promise.resolve({ id: "mockDocId" })),
  setDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(() => Promise.resolve({ empty: true })),
  collection: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ data: () => ({}) })),
  updateDoc: jest.fn(() => Promise.resolve({ data: () => ({}) })),
  arrayUnion: jest.fn(() => Promise.resolve({ data: () => ({}) })),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  uploadBytes: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true }),
  ),
}));

jest.mock("@/src/models/firebase/LocalStorageCtrl", () => ({
  storeChallengeLocally: jest.fn(() => Promise.resolve()),
  storeCommentLocally: jest.fn(() => Promise.resolve()),
  storeGroupLocally: jest.fn(() => Promise.resolve()),
  storeImageLocally: jest.fn(() => Promise.resolve()),
  setUploadTaskScheduled: jest.fn(() => Promise.resolve()),
  getUploadTaskScheduled: jest.fn(() => Promise.resolve()),
}));

jest.mock("firebase/firestore", () => ({
  arrayUnion: jest.fn((...args) => args),
  updateDoc: jest.fn(() => Promise.resolve()),
  GeoPoint: jest.fn().mockImplementation((lat, lng) => ({
    latitude: lat,
    longitude: lng,
    isEqual: (other) => lat === other.latitude && lng === other.longitude,
    toJSON: () => ({ latitude: lat, longitude: lng }),
  })),
}));

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn(() =>
    Promise.resolve({
      uid: "mockUserId",
      name: "Mock User",
      email: "mock@example.com",
      createdAt: new Date(),
    }),
  ),
}));

// Mocked dependencies
import {
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
} from "@/src/models/firebase/Firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getUser } from "@/src/models/firebase/GetFirestoreCtrl";

// Import types
import {
  DBUser,
  DBChallenge,
  DBComment,
  DBGroup,
} from "@/src/models/firebase/TypeFirestoreCtrl";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(NetInfo, "fetch").mockImplementation(
    (): Promise<any> =>
      Promise.resolve({
        isConnected: false,
        isInternetReachable: false,
      }),
  );
});

describe("SetFirestoreCtrl", () => {
  describe("createUser", () => {
    it("should create or update a user document in Firestore", async () => {
      const userId = "testUserId";
      const userData: DBUser = {
        uid: "",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      await createUser(userId, userData);

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object), // docRef
        expect.objectContaining({ uid: userId, ...userData }),
      );
    });

    it("should handle errors when writing user document", async () => {
      const error = new Error("Firestore error");
      jest
        .spyOn(Firebase, "setDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await createUser("testUserId", {
        uid: "",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error writing user document: ",
        error,
      );
    });
  });

  describe("uploadImage", () => {
    it("should upload an image when connected to the internet", async () => {
      const imageUri = "file://test-image.jpg";
      const mockBlob = new Blob(["test"], { type: "image/jpeg" });

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      global.fetch = jest.fn().mockResolvedValue({
        blob: jest.fn().mockResolvedValue(mockBlob),
      });

      (uploadBytes as jest.Mock).mockResolvedValue({});

      const imgId = await uploadImage(imageUri);

      expect(uploadBytes).toHaveBeenCalledWith(expect.any(Object), mockBlob);
      expect(imgId).toBeDefined();
    });

    it("should store image locally when offline", async () => {
      const imageUri = "file://test-image.jpg";
      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      const imgId = await uploadImage(imageUri);

      expect(uploadBytes).not.toHaveBeenCalled();
      expect(storeImageLocally).toHaveBeenCalledWith(imgId);
      expect(console.warn).toHaveBeenCalledWith(
        "No internet connection. Skipping image upload.",
      );
    });

    it("should handle errors during image upload", async () => {
      const error = new Error("Upload error");

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );
      global.fetch = jest.fn().mockRejectedValue(error);

      await expect(uploadImage("file://test-image.jpg")).rejects.toThrow(error);

      expect(console.error).toHaveBeenCalledWith(
        "Error uploading image: ",
        error,
      );
    });
  });

  describe("setName", () => {
    it("should set the name of a user", async () => {
      const id = "testUserId";
      const name = "New Name";
      const setUser = jest.fn();
      const userData: DBUser = {
        uid: id,
        name: "Old Name",
        email: "test@example.com",
        createdAt: new Date(),
      };

      jest
        .spyOn(GetFirestoreCtrl, "getUser")
        .mockImplementationOnce((): Promise<any> => Promise.resolve(userData));

      jest
        .spyOn(SetFirestoreCtrl, "createUser")
        .mockImplementationOnce((): Promise<any> => Promise.resolve(userData));

      await setName(id, name, setUser);

      expect(setUser).toHaveBeenCalledWith({ ...userData, name });
    });

    it("should handle errors when setting name", async () => {
      const error = new Error("Get user error");

      jest
        .spyOn(GetFirestoreCtrl, "getUser")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));
      const setUser = jest.fn();

      await setName("testUserId", "New Name", setUser);

      expect(console.error).toHaveBeenCalledWith("Error setting name: ", error);
    });
  });

  describe("setProfilePicture", () => {
    //it('should set the profile picture of a user', async () => {
    //  const id = 'testUserId';
    //  const imageUri = 'file://test-image.jpg';
    //  const setUser = jest.fn();
    //  const userData: DBUser = {
    //    uid: id,
    //    name: 'User',
    //    email: 'test@example.com',
    //    createdAt: new Date(),
    //  };

    //  jest.spyOn(GetFirestoreCtrl, "getUser").mockImplementationOnce(
    //    (): Promise<any> =>
    //      Promise.resolve(userData)
    //  )
    //  const mockImageId = 'imageId';

    //  jest.spyOn(SetFirestoreCtrl, "uploadImage").mockImplementationOnce(
    //    (): Promise<any> =>
    //      Promise.resolve(mockImageId)
    //  )

    //  jest.spyOn(SetFirestoreCtrl, "createUser").mockImplementationOnce(
    //    (): Promise<any> =>
    //      Promise.resolve(userData)
    //  )

    //  await setProfilePicture(id, imageUri, setUser);

    //  expect(setUser).toHaveBeenCalledWith({ ...userData, mockImageId });
    //});

    it("should handle errors when setting profile picture", async () => {
      const error = new Error("Upload error");
      jest
        .spyOn(GetFirestoreCtrl, "getUser")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));
      const setUser = jest.fn();

      await setProfilePicture("testUserId", "file://test-image.jpg", setUser);

      expect(console.error).toHaveBeenCalledWith(
        "Error setting profile picture: ",
        error,
      );
    });
  });

  describe("newChallenge", () => {
    it("should add a new challenge when online", async () => {
      const challengeData: DBChallenge = {
        caption: "Test Challenge",
        uid: "userId",
        challenge_description: "Description",
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      await newChallenge(challengeData);

      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), challengeData);
    });

    it("should store challenge locally when offline", async () => {
      const challengeData: DBChallenge = {
        caption: "Test Challenge",
        uid: "userId",
        challenge_description: "Description",
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      await newChallenge(challengeData);

      expect(addDoc).not.toHaveBeenCalled();
      expect(storeChallengeLocally).toHaveBeenCalledWith(challengeData);
    });

    it("should handle errors when writing challenge to Firestore", async () => {
      const error = new Error("Error writing challenge document to Firestore:");

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      jest
        .spyOn(Firebase, "addDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await newChallenge({
        challenge_id: "123",
        caption: "Test Challenge",
        uid: "userId",
        challenge_description: "Description",
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error writing challenge document to Firestore: ",
        error,
      );
    });

    it("should handle errors when writing challenge locally", async () => {
      const error = new Error("Error writing challenge document to Firestore:");

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      jest
        .spyOn(LocalStorageCtrl, "storeChallengeLocally")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await newChallenge({
        challenge_id: "123",
        caption: "Test Challenge",
        uid: "userId",
        challenge_description: "Description",
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error storing challenge locally: ",
        error,
      );
    });
  });

  describe("newGroup", () => {
    it("should add a new group when online", async () => {
      const groupData: DBGroup = {
        gid: "1234_5679",
        name: "Group Test 1",
        challengeTitle: "Challenge Test 1",
        members: ["James", "Rony"],
        updateDate: new Date(),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 100,
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      // Mock getDocs to return empty snapshot (group does not exist)
      jest
        .spyOn(Firebase, "getDocs")
        .mockImplementationOnce(
          (): Promise<any> => Promise.resolve({ empty: true }),
        );

      await newGroup(groupData);

      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), groupData);
    });

    it("should not add a group if it already exists", async () => {
      const groupData: DBGroup = {
        gid: "1234_5679",
        name: "Group Test 1",
        challengeTitle: "Challenge Test 1",
        members: ["James", "Rony"],
        updateDate: new Date(),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 100,
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      // Mock getDocs to return empty snapshot (group does not exist)
      jest
        .spyOn(Firebase, "getDocs")
        .mockImplementationOnce(
          (): Promise<any> => Promise.resolve({ empty: false }),
        );

      await newGroup(groupData);

      expect(console.log).toHaveBeenCalledWith("Group already exists");
      expect(addDoc).not.toHaveBeenCalled();
    });

    it("should store group locally when offline", async () => {
      const groupData: DBGroup = {
        gid: "1234_5679",
        name: "Group Test 1",
        challengeTitle: "Challenge Test 1",
        members: ["James", "Rony"],
        updateDate: new Date(),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 100,
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      await newGroup(groupData);

      expect(addDoc).not.toHaveBeenCalled();
      expect(storeGroupLocally).toHaveBeenCalledWith(groupData);
      expect(setUploadTaskScheduled).toHaveBeenCalledWith(true);
    });

    it("should handle errors when writing group to Firestore", async () => {
      const error = new Error("Firestore error");
      const groupData: DBGroup = {
        gid: "1234_5679",
        name: "Group Test 1",
        challengeTitle: "Challenge Test 1",
        members: ["James", "Rony"],
        updateDate: new Date(),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 100,
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      jest
        .spyOn(Firebase, "addDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await newGroup(groupData);
      expect(console.error).toHaveBeenCalledWith(
        "Error writing group document to Firestore: ",
        error,
      );
    });

    it("should handle errors when writing group to Local Cache", async () => {
      const error = new Error("Local error");
      const groupData: DBGroup = {
        gid: "1234_5679",
        name: "Group Test 1",
        challengeTitle: "Challenge Test 1",
        members: ["James", "Rony"],
        updateDate: new Date(),
        location: new GeoPoint(43.6763, 7.0122),
        radius: 100,
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      jest
        .spyOn(LocalStorageCtrl, "storeGroupLocally")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await newGroup(groupData);
      expect(console.error).toHaveBeenCalledWith(
        "Error storing group locally: ",
        error,
      );
    });
  });

  describe("updateGroup", () => {
    it("should handle errors when updating group", async () => {
      const error = new Error("Update error");

      jest
        .spyOn(Firebase, "getDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await updateGroup("testGroupId", new Date());

      expect(console.error).toHaveBeenCalledWith(
        "Error updating group: ",
        error,
      );
    });
  });

  describe("addGroupToMemberGroups", () => {
    it("should handle errors when adding group to member groups", async () => {
      const error = new Error("Update error");
      jest
        .spyOn(Firebase, "updateDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await addGroupToMemberGroups("testUserId", "Test Group");

      expect(console.error).toHaveBeenCalledWith("Error setting name: ", error);
    });
  });

  describe("appendComment", () => {
    it("should not add a comment if it already exists", async () => {
      const commentData: DBComment = {
        comment_text: "Test comment",
        user_name: "Test user",
        created_at: new Date(),
        post_id: "challengeId",
        uid: "userId",
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      // Mock getDocs to return non-empty snapshot (comment exists)
      jest
        .spyOn(Firebase, "getDocs")
        .mockImplementationOnce(
          (): Promise<any> => Promise.resolve({ empty: false }),
        );

      await appendComment(commentData);

      expect(console.log).toHaveBeenCalledWith("Comment already exists");
      expect(addDoc).not.toHaveBeenCalled();
    });

    it("should store comment locally when offline", async () => {
      const commentData: DBComment = {
        comment_text: "Test comment",
        user_name: "Test user",
        created_at: new Date(),
        post_id: "challengeId",
        uid: "userId",
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: false,
            isInternetReachable: false,
          }),
      );

      await appendComment(commentData);

      expect(addDoc).not.toHaveBeenCalled();
      expect(storeCommentLocally).toHaveBeenCalledWith(commentData);
      expect(setUploadTaskScheduled).toHaveBeenCalledWith(true);
    });

    it("should handle errors when writing comment to Firestore", async () => {
      const error = new Error("Firestore error");
      const commentData: DBComment = {
        comment_text: "Test comment",
        user_name: "Test user",
        created_at: new Date(),
        post_id: "challengeId",
        uid: "userId",
      };

      jest.spyOn(NetInfo, "fetch").mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            isConnected: true,
            isInternetReachable: true,
          }),
      );

      jest
        .spyOn(Firebase, "getDocs")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await appendComment(commentData);
      expect(console.error).toHaveBeenCalledWith(
        "Error writing comment document to Firestore:",
        error,
      );
    });
  });

  describe("updateLikesOf", () => {
    it("should update the likes of a challenge", async () => {
      const challengeId = "challengeId";
      const likes = ["userId1", "userId2"];

      await updateLikesOf(challengeId, likes);

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { likes },
        { merge: true },
      );
    });

    it("should handle errors when updating likes", async () => {
      const error = new Error("Update error");

      jest
        .spyOn(Firebase, "setDoc")
        .mockImplementationOnce((): Promise<any> => Promise.reject(error));

      await updateLikesOf("challengeId", ["userId1", "userId2"]);

      expect(console.error).toHaveBeenCalledWith(
        "Error updating likes: ",
        error,
      );
    });
  });

  describe("addFriend", () => {
    it("should not add friend if already friends", async () => {
      const userId = "userId";
      const friendId = "friendId";

      const userData: DBUser = {
        uid: userId,
        name: "User",
        createdAt: new Date(),
        friends: [friendId],
      };

      (getUser as jest.Mock).mockResolvedValue(userData);

      await addFriend(userId, friendId);

      expect(createUser).not.toHaveBeenCalled();
    });

    it("should handle errors when adding friend", async () => {
      const error = new Error("Get user error");
      (getUser as jest.Mock).mockRejectedValueOnce(error);

      await expect(addFriend("userId", "friendId")).rejects.toThrow(error);
      expect(console.error).toHaveBeenCalledWith(
        "Error adding friend: ",
        error,
      );
    });
  });

  describe("acceptFriend", () => {
    it("should handle errors when accepting friend", async () => {
      const error = new Error("Get user error");
      (getUser as jest.Mock).mockRejectedValueOnce(error);

      await acceptFriend("userId", "friendId");

      expect(console.error).toHaveBeenCalledWith(
        "Error accepting friend: ",
        error,
      );
    });
  });

  describe("removeFriendRequest", () => {
    it("should handle errors when removing friend request", async () => {
      const error = new Error("Get user error");
      (getUser as jest.Mock).mockRejectedValueOnce(error);

      await expect(removeFriendRequest("userId", "friendId")).rejects.toThrow(
        error,
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error unadding friend: ",
        error,
      );
    });
  });
});
