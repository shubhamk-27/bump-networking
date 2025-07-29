import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {sendEmail} from '../OtpSender';

import AuthHeader from '../components/AuthHeader';
import axios from 'axios';

const EmailVerification = ({navigation, route}) => {
  const {email, password} = route.params;

  const [code, setCode] = useState('');
  const [otp, setotp] = useState();
  const [loading, setLoading] = useState(false);

  const registerEmail = async () => {
    setLoading(true);
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const verificationHandler = async () => {
    if (otp == code) {
      await registerEmail();
      await firestore()
        .collection('Users')
        .add({
          email,
          verified: true,
        })
        .then(() => {
          console.log('code correct');
          setLoading(false);
        });
    } else {
      Alert.alert('Incorrect OTP', 'Please try again', [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  };
  useEffect(() => {
    sendMail();
  }, []);

  const emailSendAlert = () => {
    Alert.alert('Email Verification', 'Verification Code sent to your email.', [
      {
        text: 'Ok',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  const sendMail = async () => {
    console.log(email);
    // sendEmail(otp, email)
    try {
      const response = await axios.post(
        `https://bumpme-node.herokuapp.com/sendOtp`,
        {
          email,
        },
      );
      if (response.status === 201) {
        // console.log(response.data)
        setotp(response.data);

        emailSendAlert();
        setLoading(false);
      } else {
        throw new Error('An error has occurred');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View
          style={{
            marginLeft: -26,
          }}>
          <AuthHeader title1={'Verify Email ID'} backBtn={'logout'} />
        </View>

        <View style={styles.textContainer}>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Enter verification code sent
          </Text>
          <Text style={{fontSize: 18}}>to your email ID</Text>
        </View>
        <View style={styles.InputContainer}>
          <View
            style={{
              marginLeft: -12,
            }}>
            <OtpInputs
              handleChange={code => setCode(code)}
              numberOfInputs={6}
              inputContainerStyles={styles.inputCell}
              inputStyles={{
                color: 'black',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            />
          </View>
        </View>

        <Text
          onPress={() => {
            sendMail();
          }}
          style={{
            textDecorationLine: 'underline',
            fontSize: 12,
            marginTop: 40,
          }}>
          Resend Verification Email
        </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.btn,
              code.length == 6 && {backgroundColor: '#4784E1'},
            ]}
            onPress={() => verificationHandler()}>
            <Text style={{color: 'white', fontSize: 17}}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailVerification;
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 30,
    flex: 1,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputCell: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(71, 132, 225, 0.2)',
    margin: 5,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    marginVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  btn: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'rgba(56, 56, 56, 0.3)',
    height: 60,
    borderRadius: 50,
  },
});
