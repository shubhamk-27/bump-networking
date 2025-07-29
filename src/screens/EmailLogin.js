import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import auth from '@react-native-firebase/auth';

import Eye from '../assets/images/eye.png';

const EmailLogin = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isOk, setIsOK] = useState(false);
  const [loading, setLoading] = useState(false);
  const [borderColor, setBorderColor] = useState('gray');

  const loginHandler = () => {
    if (email && password) {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
        })
        .catch(error => {
          Alert.alert('Error', 'Invalid email or password.', [
            {
              text: 'OK',
              onPress: () => {
                setLoading(false);
              },
            },
          ]);
        });
    } else {
      Alert.alert('Error', 'Please insert email and password', [
        {
          text: 'OK',
          onPress: () => {
            null;
          },
        },
      ]);
    }
  };

  // check whether the input fields are filled or not.
  useEffect(() => {
    if (email && password) {
      setIsOK(true);
    } else {
      setIsOK(false);
    }
  }, [password, email]);
  if (loading) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#4784E1" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="#DDE8F9"
          // barStyle={statusBarStyle}
          // showHideTransition={statusBarTransition}
          barStyle={'dark-content'}
          hidden={false}
        />
        <AuthHeader title1="Log In with Email" />
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, {borderBottomColor: borderColor}]}>
            <TextInput
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              value={email}
              placeholderTextColor={'gray'}
              style={{color: 'black'}}
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              {...styles.inputWrapper, flexDirection: 'row'},
              password && {borderBottomColor: '#383838'},
            ]}>
            <TextInput
              style={{width: '90%', color: 'black'}}
              placeholder="Password"
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={showPassword}
              placeholderTextColor={'gray'}
            />
            <TouchableOpacity
              style={{
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={Eye}
                style={styles.icon}
                tintColor={showPassword ? 'gray' : 'black'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
            <Text style={{marginTop: 10}}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, isOk && {backgroundColor: '#4784E1'}]}
          onPress={() => loginHandler()}>
          <Text style={{color: 'white'}}>Log In</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailLogin;
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  inputContainer: {
    height: '30%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  inputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    marginTop: 30,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 100,
    alignSelf: 'center',
  },
  btn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3838384D',
    marginHorizontal: 20,
    borderRadius: 50,
    marginTop: 70,
  },
});
