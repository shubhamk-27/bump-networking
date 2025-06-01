import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import AuthHeader from '../components/AuthHeader';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isOk, setisOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetHandler = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter email', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
      return null;
    }
    setLoading(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          'Send',
          'Reset email has been send to your mail please verify.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('EmailLogin');
              },
            },
          ],
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    if (email) {
      setisOk(true);
    }
  }, [email]);

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
        <AuthHeader title1="Reset Password" />
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputWrapper]}
            keyboardShouldPersistTaps="handled">
            <TextInput
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              value={email}
              placeholderTextColor={'gray'}
              style={{color: 'black'}}
              keyboardType="email-address"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, isOk && {backgroundColor: '#4784E1'}]}
          onPress={() => resetHandler()}>
          <Text style={{color: 'white'}}>Send reset link</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;

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
