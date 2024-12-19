import { Text, Button, StyleSheet, Dimensions, Image } from "react-native";
import { CameraView } from "expo-camera";
import useCameraViewModel from "@/src/viewmodels/camera/CameraViewModel";
import { ThemedIconButton } from "@/src/views/components/theme/themed_icon_button";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { TopBar } from "@/src/views/components/navigation/top_bar";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { ThemedTextInput } from "@/src/views/components/theme/themed_text_input";

const { width, height } = Dimensions.get("window");

/**
 * Camera screen
 * @param navigation : navigation object
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a screen for the camera
 */
export default function Camera({ navigation, route }: any) {
  const {
    facing,
    permission,
    requestPermission,
    camera,
    picture,
    caption,
    isCameraEnabled,
    isFlashEnabled,
    isLocationEnabled,
    toggleCameraFacing,
    toggleFlashMode,
    toggleLocation,
    toggleCameraState,
    setCaption,
    takePicture,
    makeChallenge,
    goBack,
    isInHome,
  } = useCameraViewModel(navigation, route);

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.message}>
          Errors occurred while requesting permission
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} colorType="backgroundPrimary">
      <TopBar title="Camera" leftIcon="chevron-down" leftAction={goBack} />
      {isCameraEnabled ? (
        <ThemedView style={styles.cameraContainer} colorType="transparent">
          <CameraView
            style={styles.camera}
            facing={facing}
            enableTorch={isFlashEnabled}
            ref={camera}
            zoom={0}
            mirror={facing === "front"}
            testID="camera-view"
          />

          <ThemedView style={styles.buttonPlaceHolder} colorType="transparent">
            <ThemedIconButton
              style={styles.changeOrientationAndFlash}
              onPress={toggleFlashMode}
              name={isFlashEnabled ? "flash" : "flash-off"}
              size={24}
              color="white"
              testID="Flash-Button"
            />

            <ThemedIconButton
              style={styles.takePicture}
              onPress={takePicture}
              name="radio-button-off-sharp"
              size={100}
              color="white"
              testID="Camera-Button"
            />

            <ThemedIconButton
              onPress={toggleCameraFacing}
              testID="Switch-Button"
              style={styles.changeOrientationAndFlash}
              name="camera-reverse"
              size={24}
              color="white"
            />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.cameraContainer} colorType="transparent">
          <ThemedView style={styles.camera} colorType="transparent">
            <Image source={{ uri: picture?.uri }} style={styles.preview} />
            <ThemedView style={styles.button} colorType="transparent">
              {isInHome && (
                <ThemedView style={styles.buttonContainer}>
                  <ThemedIconButton
                    onPress={toggleLocation}
                    name={`navigate-circle${isLocationEnabled ? "" : "-outline"}`}
                    size={35}
                    color="white"
                    testID="Location-Button"
                  />
                  <ThemedText colorType="textPrimary">
                    {isLocationEnabled
                      ? " Location Enabled  "
                      : " Location Disabled  "}
                  </ThemedText>
                </ThemedView>
              )}
              <ThemedView style={[styles.buttonContainer, { gap: 10 }]}>
                <ThemedIconButton
                  onPress={toggleCameraState}
                  name={"refresh-circle"}
                  size={40}
                  color="white"
                  testID="Reload-Button"
                />
                <ThemedIconButton
                  onPress={makeChallenge}
                  name="arrow-redo-circle"
                  size={40}
                  color="white"
                  testID="Submit-Button"
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedTextInput
            style={styles.input}
            placeholder="Caption"
            onChangeText={setCaption}
            value={caption}
            viewWidth="98%"
            colorType="white"
            testID="Caption-Input"
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },

  camera: {
    flex: 3,
    alignSelf: "center",
    alignItems: "center",
    maxHeight: height * 0.65,
    width: width,
    borderRadius: 30,
    marginTop: 10,
    justifyContent: "flex-end",
  },

  takePicture: {
    backgroundColor: "transparent",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },

  changeOrientationAndFlash: {
    backgroundColor: "transparent",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },

  cameraContainer: {
    flex: 1,
    alignItems: "center",
  },

  buttonPlaceHolder: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: width,
    marginTop: 30,
    marginBottom: 60,
  },

  button: {
    margin: 10,
    borderRadius: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },

  buttonContainer: {
    borderRadius: 90,
    backgroundColor: "#00000088",
    flexDirection: "row",
    alignItems: "center",
  },

  preview: {
    height: height * 0.65,
    width: width,
    bottom: 0,
    left: 0,
    borderRadius: 30,
    position: "absolute",
  },

  input: {
    alignSelf: "center",
    width: "100%",
    padding: 10,
    marginVertical: 30,
    textAlign: "center",
    fontSize: 20,
  },
  switch: {
    alignSelf: "flex-start",
    width: "15%",
    borderWidth: 2,
    borderRadius: 15,
  },
  switchText: {
    width: "90%",
    padding: 15,
    alignSelf: "center",
  },
  containerRow: {
    width: "90%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    padding: 15,
  },
});
