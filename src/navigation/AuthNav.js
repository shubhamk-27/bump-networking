import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Welcome from '../screens/Welcome';
import OnBoarding from '../screens/OnBoarding';
import Login from '../screens/Login';
import EmailLogin from '../screens/EmailLogin';
import EmailSignUP from '../screens/EmailSignup';
import SignUp from '../screens/SignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EmailVerification from '../screens/EmailVerification';

const Stack = createStackNavigator();

const AuthNav = () => {
  const [initalRoute, setInitialRoute] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      const value = await AsyncStorage.getItem('isInitiated');
      if (value !== null) {
        setInitialRoute('Welcome');
      } else {
        setInitialRoute('boarding');
      }
      setLoading(false);
    } catch (e) {
      // error reading value
      console.log(e, 'error reading asyncStorage');
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      // <SplashScreen/>
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
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initalRoute}>
      <Stack.Screen name="boarding" component={OnBoarding} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="EmailLogin" component={EmailLogin} />
      <Stack.Screen name="EmailSignUp" component={EmailSignUP} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Reset" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
    </Stack.Navigator>
  );
};

export default AuthNav;
