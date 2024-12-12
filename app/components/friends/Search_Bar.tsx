import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";

/**
 * Search bar component
 * @param onSearch : function to call when the user types in the search bar
 * @returns SearchBar Component
 */
export const SearchBar = ({
  onSearch,
}: {
  readonly onSearch: (text: string) => void;
}) => (
  <ThemedView style={styles.searchContainer} testID="search-bar">
    <ThemedTextInput
      style={styles.searchInput}
      placeholder="Search for a user..."
      placeholderTextColor="#aaa"
      onChangeText={onSearch}
    />
  </ThemedView>
);

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
