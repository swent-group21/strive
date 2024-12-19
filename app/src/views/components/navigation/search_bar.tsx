import { StyleSheet } from "react-native";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedTextInput } from "@/src/views/components/theme/themed_text_input";

/**
 * Search bar component
 * @param onSearch : function to call when the user types in the search bar
 * @returns SearchBar Component
 */
export function SearchBar({
  onSearch,
  element,
}: {
  readonly onSearch: (text: string) => void;
  readonly element: string;
}) {
  return (
    <ThemedView style={styles.searchContainer} testID="search-bar">
      <ThemedTextInput
        style={styles.searchInput}
        placeholder={`Search for a ${element}...`}
        placeholderTextColor="#aaa"
        onChangeText={onSearch}
        testID="search-bar-input"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: "transparent",
    width: "100%",
  },
  searchInput: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
