const resolvedUser = {
  user: {
    metadata: {
      creationTime: 0,
      lastSignInTime: 0,
    },
    uid: "12345",
  },
};

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => {
    {
    }
  }),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
  FirebaseError: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => {}),
  ref: jest.fn(),
  uploadString: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => {}),
  initializeFirestore: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
      withConverter: jest.fn(),
      getUser: "admin",
    }),
  }),
  getDocs: jest.fn(),
  query: jest.fn(),
  setDoc: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  updateDoc: jest.fn(),
  GeoPoint: jest.fn().mockImplementation((lat, lng) => ({
    latitude: lat,
    longitude: lng,
    isEqual: (other) => lat === other.latitude && lng === other.longitude,
    toJSON: () => ({ latitude: lat, longitude: lng }),
  })),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signInWithCredential: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signOut: jest.fn(() => Promise.resolve()), // Explicitly return a resolved promise
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithPopup: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithRedirect: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
  updateCurrentUser: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock registerRootComponent from 'expo'
jest.mock("expo", () => ({
  registerRootComponent: jest.fn(),
}));

// Mock gesture-handler
jest.mock("./gesture-handler", () => {});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock the logInWithEmail function
jest.mock("@/types/Auth", () => ({
  ...jest.requireActual("@/types/Auth"),
  isValidEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  logInWithEmail: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock("react-native-elements", () => {
  const React = require("react");
  return {
    // Mock Icon component
    Icon: (props) => {
      return <React.Fragment>{/* Mock implementation */}</React.Fragment>;
    },
    // Mock IconProps if necessary
    IconProps: {},
    // Mock other exports if needed
  };
});

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation((props) => <View {...props} testID="map-view" />),
    Marker: jest
      .fn()
      .mockImplementation((props) => <View {...props} testID="map-marker" />),
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }),
  ),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
