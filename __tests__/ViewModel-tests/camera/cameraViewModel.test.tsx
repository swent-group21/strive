import useCameraViewModel from "@/src/viewmodels/camera/CameraViewModel";
import { renderHook, act } from "@testing-library/react-native";
import { useCameraPermissions, CameraCapturedPicture } from "expo-camera";

// Mock `expo-camera`
jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  CameraType: {
    BACK: "back",
    FRONT: "front",
  },
  FlashMode: {
    ON: "on",
    OFF: "off",
  },
}));

const mockFirestoreCtrl = {
  uploadImageFromUri: jest.fn().mockResolvedValue("mock-image-id"),
};

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    group_id: "mock-group-id",
  },
};

describe("useCameraViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default states", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { status: "granted" },
      jest.fn(),
    ]);
    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    expect(result.current.facing).toBe("back");
    expect(result.current.flashMode).toBe("off");
    expect(result.current.isFlashEnabled).toBe(false);
    expect(result.current.zoom).toBe(0);
    expect(result.current.isCameraEnabled).toBe(true);
    expect(result.current.picture).toBeUndefined();
  });

  it("should toggle camera facing", () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    act(() => {
      result.current.toggleCameraFacing();
    });

    expect(result.current.facing).toBe("front");

    act(() => {
      result.current.toggleCameraFacing();
    });

    expect(result.current.facing).toBe("back");
  });

  it("should toggle flash mode", () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    act(() => {
      result.current.toggleFlashMode();
    });

    expect(result.current.flashMode).toBe("on");
    expect(result.current.isFlashEnabled).toBe(true);

    act(() => {
      result.current.toggleFlashMode();
    });

    expect(result.current.flashMode).toBe("off");
    expect(result.current.isFlashEnabled).toBe(false);
  });

  it("should handle image URL generation and navigate to CreateChallenge", async () => {
    mockFirestoreCtrl.uploadImageFromUri.mockResolvedValue("mock-image-id");

    const mockPicture: CameraCapturedPicture = {
      uri: "mock-picture-uri",
      width: 1080,
      height: 1920,
      base64: "mock-base64",
    };

    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    // Set the picture state directly
    act(() => {
      result.current.setIsCameraEnabled(false);
      result.current.picture = mockPicture; // Set the picture before calling imageUrlGen
    });

    await act(async () => {
      await result.current.imageUrlGen();
    });

    expect(mockFirestoreCtrl.uploadImageFromUri).toHaveBeenCalled;
    expect(mockNavigation.navigate).toHaveBeenCalledWith("CreateChallenge", {
      group_id: "mock-group-id",
      image_id: "mock-image-id",
    });
  });

  it("should request camera permissions", async () => {
    const mockRequestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      null,
      mockRequestPermission,
    ]);

    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
  });
});
