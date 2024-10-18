import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const {width, height} = Dimensions.get('window');
export default function SetProfilePicture() {
    const router = useRouter();
    return (
        <View style = {styles.backround}>

          <Image 
            source={require('@/assets/images/auth/SignUpScreen/Ellipse 3.png')}
            style={styles.ellipse}
          />
          
            <View style = {styles.inputColumn}>
            
            {/* Title of the screen */}
            <Text style = {styles.title}>Set up your profile picture</Text>

            {/* Go back button */}
            <TouchableOpacity style={styles.goBack} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* The profile picture */}
            <TouchableOpacity style={styles.imageContainer} onPress = {() => alert('Change profile picture')}>
                <Image
                    source={require('@/assets/images/auth/SignUpScreen/Profile-PNG-File.png')}
                    style={styles.profilePicture}
                    
                />
            </TouchableOpacity>
          </View>
            {/* Go further button */}
            <TouchableOpacity style={styles.goFurther} onPress={() => alert('Go further')}>
                <Text style = {styles.textButton}> Maybe Later </Text>
            </TouchableOpacity> 


        </View>
            );
}

const styles = StyleSheet.create({
    goBack : {
        position : 'absolute',
        top : height * 0.05,
        left : width * 0.05,
        width : width * 0.1,
        height : width * 0.1,
        backgroundColor : 'black',
        borderRadius : 90,
        justifyContent : 'center',
        alignItems : 'center',
      }, 
    goFurther : {
        position : 'absolute',
        top : height * 0.8,
        left : width * 0.05,
        width : width * 0.9,
        height : width * 0.1,
        backgroundColor : 'black',
        borderRadius : 90,
        justifyContent : 'center',
        alignItems : 'center',
      },
    title: {
        fontSize: width * 0.14,  
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingTop: height * 0.12,
        paddingBottom: height * 0.05,
        
      },
    inputColumn : {
        marginTop : height * 0.1,
        alignItems : 'center',
    },
    input : {
        width : width * 0.8,
        height : height * 0.1,
        backgroundColor : 'white',
        borderRadius : 10,
        fontSize : 20,
        paddingLeft : width * 0.05,
    },
    backround : {
        backgroundColor : 'transparent',
        flex : 1,
        alignItems : 'center',
        justifyContent : 'flex-start',
    },
    ellipse : {
        position : 'absolute',
        top : -100,
        left : width*0.6,
        transform: [{ rotate: '90deg' }],
      },

    profilePicture : {  
        width : width * 0.8,
        height : width * 0.8,
        position : 'absolute',
        top : 0,
        left : width * 0.01,
        borderRadius : 10,
    },

    imageContainer : {
        width : width * 0.8,
        height : width * 0.8,
        fontSize : 20,
        paddingLeft : width * 0.05,
        justifyContent : 'center',
        alignItems : 'center',

    },

    textButton: {
        fontSize: width * 0.045,  
        color: 'white',
        fontWeight: 'bold',
    }
});