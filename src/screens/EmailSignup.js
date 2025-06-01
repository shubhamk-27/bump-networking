import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import AuthHeader from '../components/AuthHeader';
import Eye from '../assets/images/eye.png';

const EmailSignUP = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isOk, setIsOk] = useState(false);

  const [pwdStrength, setPwdStrength] = useState({
    status: 'weak',
    color: '#FF5252',
  });
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(true);

  // verification
  useEffect(() => {
    if (password.length >= 8 && email != '' && toggleCheckBox) {
      setIsOk(true);
    } else {
      setIsOk(false);
    }

    if (password.length >= 12) {
      setPwdStrength({status: 'strong', color: 'green'});
    } else {
      setPwdStrength({status: 'weak', color: '#FF5252'});
    }
  }, [password, email, toggleCheckBox]);

  const onClickHandler = async () => {
    if (!validEmail)
      return Alert.alert('Error', 'Not a valid email.', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'cancel',
        },
      ]);

    setLoading(true);
    const a = await auth().fetchSignInMethodsForEmail(email);
    if (a.length > 0) {
      setLoading(false);
      Alert.alert('Error', 'Email already in use. Please Login to continue.', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'cancel',
        },
      ]);
    } else {
      setLoading(false);
      navigation.navigate('EmailVerification', {email, password});
    }
  };

  // for validating email
  useEffect(() => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
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
        <AuthHeader title1="Sign Up with Email" />
        <View style={styles.inputContainer}>
          <View
            style={{
              ...styles.inputWrapper,
              borderBottomColor: validEmail ? 'gray' : 'red',
            }}>
            <TextInput
              style={{color: 'black'}}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              value={email}
              placeholderTextColor={'gray'}
              keyboardType="email-address"
            />
          </View>
          <Text style={{paddingTop: 10, fontSize: 12}}>
            You will need to verify that you own this account.
          </Text>

          <View
            style={[
              styles.inputWrapper,
              {flexDirection: 'row'},
              password.length >= 8 && {borderBottomColor: pwdStrength.color},
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

          <View style={{flexDirection: 'row', marginTop: 10}}>
            {/* <View style={[styles.dot, { backgroundColor: password.length >= 8 ? 'black' : 'gray' }]} /> */}
            {password.length >= 8 ? (
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 13}}>Password strength </Text>
                <Text style={{fontSize: 13, color: pwdStrength.color}}>
                  {pwdStrength.status}
                </Text>
              </View>
            ) : (
              <Text style={{fontSize: 13}}>
                Please enter a password with atleast 8 characters.
              </Text>
            )}
          </View>

          <View style={styles.chkboxContainer}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
              tintColors={{false: 'gray', true: '#4784E1'}}
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginLeft: Platform.OS == 'ios' ? 20 : 0,
              }}>
              <Text style={{alignSelf: 'center', fontSize: 12}}>
                I have read and agree to
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 12,

                  marginTop: 5,
                  //fontFamily: 'Poppins-Bold'
                }}
                onPress={() => Linking.openURL('https://bumpme.in/privacy')}>
                {' '}
                Privacy Policy{' '}
              </Text>
              <Text style={{alignSelf: 'center', fontSize: 12}}> and</Text>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 12,
                  //fontFamily: 'Poppins-Bold'
                }}
                onPress={() => Linking.openURL('https://bumpme.in/terms')}>
                Terms of services.
              </Text>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView>
          <TouchableOpacity
            disabled={!isOk}
            style={[styles.btn, isOk && {backgroundColor: '#4784E1'}]}
            onPress={() => onClickHandler()}>
            <Text style={{color: 'white'}}>Sign Up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailSignUP;
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  inputContainer: {
    height: '50%',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  inputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    marginTop: 15,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 100,

    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  chkboxContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'flex-start',
  },
  btn: {
    marginTop: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#3838384D',
  },
});
