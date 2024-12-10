import React from "react";
import { StyleSheet } from "react-native";
import MapView, { MapMarker } from "react-native-maps";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedText } from "@/components/theme/ThemedText";
import { TopBar } from "@/components/navigation/TopBar";
import { useMapScreenViewModel } from "@/src/viewmodels/map/MapScreenViewModel";
import FirestoreCtrl, { DBChallenge, DBUser } from "@/src/models/firebase/FirestoreCtrl";

/**
 * Screen for the map
 * @param user : user object
 * @param navigation : navigation object
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a screen for the map
 */
export default function MapScreen({
  user,
  navigation,
  firestoreCtrl,
  route,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
  readonly route: any;
}) {
  const firstLocation = route.params?.location;
  const { userLocation, challengesWithLocation, navigateGoBack } =
    useMapScreenViewModel(firestoreCtrl, navigation, firstLocation);

  const uri = "@/assets/images/icon_trans.png";

  if (userLocation === undefined) {
    return (
      <ThemedView>
        <ThemedText>Getting location...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Map"
        leftIcon="arrow-back"
        leftAction={() => navigateGoBack()}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        zoomControlEnabled={true}
        mapType="standard"
        showsUserLocation={true}
        showsCompass={true}
        loadingEnabled={true}
      >
        {challengesWithLocation.map((challenge: DBChallenge, index) => (
          <MapMarker
            key={index}
            testID={challenge.caption}
            coordinate={{
              latitude: challenge.location.latitude,
              longitude: challenge.location.longitude,
            }}
            image={require(uri)}
            flat={true}
            title={challenge.caption}
            description={`${challenge.date.toLocaleString()}`}
            onCalloutPress={() => {
              navigation.navigate("Maximize", {
                challenge: challenge,
              });
            }}
          />
        ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
