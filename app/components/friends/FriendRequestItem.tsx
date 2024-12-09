import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedIconButton } from "@/components/theme/ThemedIconButton";

/**
 * Friend Request Item component
 * @param name : name of the user
 * @param avatar : avatar of the user
 * @param onAccept : function to accept a friend request
 * @param onDecline : function to decline a friend request
 * @returns FriendRequestItem Component
 */
export const FriendRequestItem = ({
  name,
  avatar,
  onAccept,
  onDecline,
  testID,
}: any) => (
  <ThemedView style={styles.requestItem} testID="friend-request-item">
    {avatar ? (
      <Image
        source={{ uri: avatar }}
        style={styles.avatar}
        testID={`friend-avatar-${testID}`}
      />
    ) : (
      <ThemedView
        style={[styles.avatar, styles.defaultAvatar]}
        testID={`friend-avatar-${testID}`}
      >
        <ThemedText
          style={styles.avatarText}
          testID={`friend-avatar-text-${testID}`}
        >
          {name.charAt(0).toUpperCase()}
        </ThemedText>
      </ThemedView>
    )}
    <ThemedText style={styles.name} testID={`friend-name-${testID}`}>
      {name}
    </ThemedText>
    <View
      style={styles.requestButtons}
      testID={`friend-request-buttons-${testID}`}
    >
      {/* Accept Button with Icon */}
      <ThemedIconButton
        name="check"
        onPress={onAccept}
        testID={`accept-button-${testID}`}
        color="#fff"
        style={styles.acceptButton}
      />

      {/* Decline Button with Icon */}

      <ThemedIconButton
        name="close"
        onPress={onDecline}
        testID={`decline-button-${testID}`}
        color="#fff"
        style={styles.declineButton}
      />
    </View>
  </ThemedView>
);

const styles = StyleSheet.create({
  acceptButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  declineButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  requestButtons: {
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginLeft: "auto",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  defaultAvatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundSecondary,
  },
  avatarText: {
    color: Colors.light.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "transparent",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
