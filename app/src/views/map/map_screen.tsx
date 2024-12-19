import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import MapView, { MapCircle, MapMarker } from "react-native-maps";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { TopBar } from "@/src/views/components/navigation/top_bar";
import { useMapScreenViewModel } from "@/src/viewmodels/map/MapScreenViewModel";
import { DBChallenge, DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";

/**
 * Screen for the map
 * @param user : user object
 * @param navigation : navigation object
 * @param route : route object
 * @returns : a screen for the map
 */
export default function MapScreen({
  user,
  navigation,
  route,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly route: any;
}) {
  const firstLocation = route.params?.location;
  const geoRestriction = route.params?.challengeArea;
  const {
    userLocation,
    challengesWithLocation,
    navigateGoBack,
    challengeArea,
    isMapReady,
    setIsMapReady,
  } = useMapScreenViewModel(navigation, firstLocation, geoRestriction);

  if (userLocation === undefined || challengesWithLocation.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <ThemedText style={styles.loadingText}>
          Loading, this may take some time...
        </ThemedText>
      </ThemedView>
    );
  } else {
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
          onMapReady={() => setIsMapReady(true)}
          testID="map"
        >
          {/* Draw the challenges on the map */}
          {challengesWithLocation.map((challenge: any, index: number) => (
            <MapMarker
              testID={`map-marker-${index}`}
              key={index}
              coordinate={{
                latitude: challenge.location.latitude,
                longitude: challenge.location.longitude,
              }}
              title={challenge.caption}
              description={challenge.date?.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              onCalloutPress={() => {
                navigation.navigate("Maximize", {
                  challenge,
                  user,
                });
              }}
            />
          ))}

          {/* Draw the challenge area on the map, if any */}
          {challengeArea && (
            <MapCircle
              center={{
                latitude: challengeArea.center.latitude,
                longitude: challengeArea.center.longitude,
              }}
              radius={challengeArea.radius}
              strokeWidth={1}
              strokeColor="#000000"
              fillColor="rgba(0,0,0,0.2)"
            />
          )}
        </MapView>
      </ThemedView>
    );
  }
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});
