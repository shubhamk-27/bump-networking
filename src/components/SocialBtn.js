import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import firestore from '@react-native-firebase/firestore';

import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {RFValue} from 'react-native-responsive-fontsize';

const SocialBtn = ({title, icon, signUp}) => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const clickHandler = async () => {
    if (title.trim() == 'Email') {
      if (signUp) {
        navigation.navigate('EmailSignUp');
      } else navigation.navigate('EmailLogin');
    }
    if (title.trim() == 'Google') {
      GoogleSignin.configure({
        scopes: ['email'],
        webClientId:
          '412907293114-1utcic8dehsmsr0kadritmeoajpmar48.apps.googleusercontent.com',
        offlineAccess: true,
      });
      googleLogin().then(() => setLoading(false));
    }
    if (title.trim() == 'Facebook') {
      onFacebookButtonPress().then(() => setLoading(false));
    }
    if (title.trim() == 'Sign in with Apple') {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    }
  };
  async function onFacebookButtonPress() {
    try {
      setLoading(true);
      LoginManager.logOut();

      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      return auth().signInWithCredential(facebookCredential);
    } catch (error) {
      console.log(error);
      emailAlreadyUseAlert();
      setLoading(false);
    }
  }

  const googleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      if (!idToken) throw 'Error';
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      if (!googleCredential) throw 'Error';

      return auth().signInWithCredential(googleCredential);
    } catch (err) {
      console.log(err);
      emailAlreadyUseAlert();
      setLoading(false);
    }
  };
  const emailAlreadyUseAlert = () => {
    return Alert.alert(
      'Error',
      'Your email address is already configured. Please Login with the email option.',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'cancel',
        },
      ],
    );
  };
  if (loading) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#4784E1" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => clickHandler()}>
      <View style={styles.icon}>
        <Image
          source={icon}
          style={{width: 27, height: 30, resizeMode: 'contain'}}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialBtn;
const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '90%',
    alignItems: 'center',
    paddingLeft: 20,
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 50,
    borderColor: '#0000001A',
  },
  icon: {
    width: 30,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: RFValue(18, 640),
    width: 150,
    marginLeft: -0,
    textAlign: 'left',
  },
});
