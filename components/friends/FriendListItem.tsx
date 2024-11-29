import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/theme/ThemedText';
import { ThemedView } from '@/components/theme/ThemedView';

export const FriendListItem = ({ name, avatar, onPress }: any) => (
  <TouchableOpacity
    style={styles.friendItem}
    onPress={onPress}
    testID="friend-list-item"
  >
    {avatar ? (
      <Image
        source={{ uri: avatar }}
        style={styles.friendAvatar}
        testID="friend-avatar-image"
      />
    ) : (
      <ThemedView
        style={[styles.friendAvatar, styles.defaultAvatar]}
        testID="friend-default-avatar"
      >
        <ThemedText style={styles.avatarText} testID="friend-avatar-text">
          {name.charAt(0).toUpperCase()}
        </ThemedText>
      </ThemedView>
    )}
    <ThemedText style={styles.friendName} testID="friend-name">
      {name}
    </ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  friendItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  friendName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#800080',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
