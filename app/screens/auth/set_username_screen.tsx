import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const {width, height} = Dimensions.get('window');

export default function SetUsername() {
    const [username, setUsername] = React.useState("");
    const router = useRouter();
    return (
        <View style = {styles.backround}>

          {/* Image in the backround out of the scroll view for immonility */}
          <Image 
            source={require('@/assets/images/auth/SignUpScreen/Ellipse 3.png')}
            style={styles.ellipse}
          />
          
          <View style = {styles.inputColumn}>
            
            {/* Title of the screen */}
            <Text style = {styles.title}>Set up your username</Text>

            {/* Go back button */}
            <TouchableOpacity style={styles.goBack} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* The input field for username */}
            <TextInput
                style = {styles.input}
                placeholder='how will your friends find you ?'
                placeholderTextColor="#888"
                onChangeText={(text) => setUsername(text)}
                autoCorrect = {false}
            />

          </View>
            {/* Go further button */}
            <TouchableOpacity style={styles.goFurther} onPress={() => router.push('/screens/auth/profile_picture_screen')}>
                <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>


          <Image
            source={require('@/assets/images/goat.png')}
            style={styles.backroundimage}
          /> 

        </View>


    );
}

const styles = StyleSheet.create({
    goBack : {
        position : 'absolute',
        top : height * 0.07,
        left : width * 0.01,
        width : width * 0.1,
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

      backroundimage : {
        position : 'absolute',
        top : height * 0.6,
        left : width*0.6,
        
        
      },

      ellipse : {
        position : 'absolute',
        top : -100,
        left : width*0.6,
        transform: [{ rotate: '90deg' }],
        
      },

      input: {
        width: '100%',
        height: height * 0.06,  
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#ccc',
        paddingLeft: 20,
        marginBottom: height * 0.02,
        top : height * 0.13,
        
      },

      inputColumn: {
        width: '90%',
        height: '60%',
        flexDirection: 'column',       
        justifyContent: 'flex-start', 
        alignItems: 'center',       
        gap: height * 0.001,
      },

      backround : {
        backgroundColor : 'white',
        flex : 1,
        alignItems : 'center',
        justifyContent : 'flex-start',
      }, 
});