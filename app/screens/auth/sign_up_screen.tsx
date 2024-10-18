import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useRouter } from 'expo-router';

const {width, height} = Dimensions.get('window');


/**
 * Sign Up screen
 * @returns - The Sign Up screen
 */
export default function SignUp() {
    const [name, setName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const router = useRouter();

    return (

      <View> 

        {/* Image in the backround out of the scroll view for immonility */}
        <Image
          source={require('@/assets/images/auth/SignUpScreen/Ellipse 3.png')}
          style={styles.backroundimage}
        />
       
        <ScrollView>
        
          {/* Color of the backround */}
          <View style = {styles.backround}>

          {/* Go back button */}
          <TouchableOpacity style={styles.goBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Title of the screen */}
          <Text style = {styles.title}>Tell us about you !</Text>

          {/* The input fields */}
          <View style = {styles.inputColumn}>
              
              {/* Name */}
              <Text style = {styles.titleinput}>Name *</Text>
              <TextInput 
                style = {styles.input}
                placeholder='Name'
                placeholderTextColor="#888"
                onChangeText={(text) => setName(text)}
                autoComplete='name'

              />
              
              {/* Surname */}
              <Text style = {styles.titleinput}>Surname *</Text>
              <TextInput
                style = {styles.input}
                placeholder='Surname'
                placeholderTextColor="#888"
                onChangeText={(text) => setSurname(text)}
                autoComplete='family-name'

              />

              {/* Email */}
              <Text style = {styles.titleinput}>Email *</Text>
              <TextInput
                style = {isValidEmail(email) || email.length == 0 ? styles.input : styles.inputWrong}
                placeholder="example@your.domain"
                placeholderTextColor="#888"
                autoComplete='email'
                inputMode='email'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
                maxLength={50}
              />

              {/* Password */}
              <Text style = {styles.titleinput}>Password *</Text>
              <TextInput
                style = {password.length >= 8 || password.length == 0? styles.input : styles.inputWrong}
                placeholder='Password'
                placeholderTextColor="#888"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
              />
        

              {/* Confirm Password */}
              <Text style = {styles.titleinput}>Confirm Password *</Text>
              <TextInput
                style = {confirmPassword.length == 0 ||password == confirmPassword ? styles.input : styles.inputWrong}
                placeholder= 'Confirm Password'
                placeholderTextColor="#888"
                secureTextEntry={true}
                onChangeText={(text) => setConfirmPassword(text)}
              />

              {/* Register Button */}
              <TouchableOpacity style={styles.buttonStrive} onPress={() => onClickStrive(password, confirmPassword, name, surname, email)}>
                <Text style={styles.buttonText}>Strive with us</Text>
              </TouchableOpacity>

          
              {/* OR */}
              <Text style = {styles.or}> 
                  OR
              </Text>

              {/* Sign Up buttons for Google */}
              <TouchableOpacity style={styles.buttonContinueWith} onPress={() => alert('Sign In with Google')}>
                <View style={styles.buttonIcon}>
                    <Image source={require('@/assets/images/auth/SignUpScreen/google.png')} style={styles.icon} />
                    <Text style={styles.buttonText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Sign Up buttons for Facebook */}
              <TouchableOpacity style={styles.buttonContinueWith} onPress={() => alert('Sign In with Facebook')}>
                <View style={styles.buttonIcon}>
                    <Image source={require('@/assets/images/auth/SignUpScreen/facebook.png')} style={styles.icon} />
                    <Text style={styles.buttonText}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>
              

              </View>
          
          </View>

        </ScrollView>

      </View>
    );
  }

    

/*** 
 * Function to check if the email is valid
 * @param email - email to be checked
 * @returns - true if the email is valid, false otherwise
 */
function isValidEmail(email : string) {
  let reg = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}

/**
 * Function to check the validity of the input fields and alert the user if there is an error
 * @param password 
 * @param confirmPassword 
 * @param name 
 * @param surname 
 * @param email 
 * @returns
 */
function onClickStrive(password : string, confirmPassword : string, name : string, surname : string, email : string) {
  if (name.length == 0) {
    alert('Name cannot be empty');
}

else if (surname.length == 0) {
    alert('Surname cannot be empty');
}

else if (email.length == 0) {
    alert('Email cannot be empty');
}

else if (password != confirmPassword) {
    alert('Passwords do not match');
}
else if (password.length < 8) {
    alert('Password must be at least 8 characters long');
}
else {
    router.push('/screens/auth/set_username_screen');
}


}

/**
 * Styles for the components
 */
const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: height * 0.06,  
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#ccc',
    paddingLeft: 20,
    marginBottom: height * 0.02,
    
  },
  title: {
    fontSize: width * 0.14,  
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingTop: height * 0.12,
    paddingBottom: height * 0.05,
    
  },
  buttonStrive: {
    width: '100%',
    height: height * 0.05,  
    backgroundColor: '#E6BC95',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

  },

  or : {
    position : 'relative',
    textAlign: 'center',
    height : height * 0.04,
    fontSize: width * 0.03, 
    textAlignVertical: 'center',
    color: 'black',
    paddingTop: height * 0.02,
    
  }, 

  backround : {
    backgroundColor : 'transparent',
    flex : 1,
    alignItems : 'center',
    justifyContent : 'flex-start',
  }, 

  titleinput : {
    fontSize: width * 0.04,  
    color: 'black',
    width: '100%',
    textAlign: 'left',
    marginBottom: height * 0.01,
  }, 

  backroundimage : {
    position : 'absolute',
    top : 0,
    left : 0,
  }, 

  buttonText: {
    fontSize: width * 0.045,  
    color: 'black',
  },

  inputColumn: {
    width: '83%',
    height: '60%',
    flexDirection: 'column',       
    justifyContent: 'center', 
    alignItems: 'center',       
    gap: height * 0.001,
  },

  buttonContinueWith: {
    width: '100%',
    height: height * 0.05,  
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  buttonIcon: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },

  icon: {
    width: 20, 
    height: 20, 
    marginRight: 10, 
  },

  inputWrong: {
    width: '100%',
    height: height * 0.06,  
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'red',
    paddingLeft: 20,
    marginBottom: height * 0.02,
  }, 

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

});