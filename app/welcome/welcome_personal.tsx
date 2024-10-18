import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WelcomeConceptScreen() {
    return (
        <View style={styles.container} testID="welcomePersonal">
            <View style={styles.ovalShape} testID="ovalShape3"/>
            <View style={styles.textContainer} testID="textContainer3">
                <Text style={styles.title} testID="welcomeTitle3">Compete{'\n'}yourself</Text>
                <Text style={styles.description} testID="welcomeDescription3">
                    Become the best version of yourself{'\n'} 
                    Interact with motivated people to reach your goals !
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    ovalShape: {
        position: 'absolute',
        top: -SCREEN_HEIGHT * 0.4,
        left: -SCREEN_WIDTH * 0.3,
        width: SCREEN_WIDTH * 1.3,
        height: SCREEN_HEIGHT * 0.7,
        borderRadius: SCREEN_WIDTH * 0.7,
        backgroundColor: '#E6BC95',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 0,
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        color: '#000',
        lineHeight: 62,
        marginBottom: 20,
    },
    description: {
        paddingTop: 60,
        fontSize: 20,
        fontWeight: '800',
        color: '#000',
        lineHeight: 26,
    },
});
