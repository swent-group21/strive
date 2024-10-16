import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeConceptScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>welcome_concept.tsx</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    text: {
        fontSize: 20,
    },
});