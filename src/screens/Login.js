import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import SocialBtn from '../components/SocialBtn';

import AppleLogo from '../assets/images/apple.png';
import FacebookLogo from '../assets/images/facebook.png';
import GoogleLogo from '../assets/images/google.png';
import EmailLogo from '../assets/images/email.png';

const Login = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor='#DDE8F9'
          // barStyle={statusBarStyle}
          // showHideTransition={statusBarTransition}
          barStyle={'dark-content'}
          hidden={false} />

        <AuthHeader
          navigation={navigation}
          title1={'Log In'}
          title2={null}
          style={{
            textAlign: 'center',
          }}
        />

        <View style={styles.btnContainer}>
          {Platform.OS === 'ios' && < SocialBtn title={'Sign in with Apple'} icon={AppleLogo} />}
          <SocialBtn title={'Facebook'} icon={FacebookLogo} />
          <SocialBtn title={'  Google'} icon={GoogleLogo} />
          <SocialBtn title={'   Email'} icon={EmailLogo} />
        </View>
        <View style={styles.textContainer}>
          <Text>Did you want to </Text>
          <Text
            style={{ fontSize: 18, fontWeight: '700' }}
            onPress={() => navigation.navigate('SignUp')}>
            {' '}
            Sign Up?
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  btnContainer: {
    marginTop: 0,
    height: '50%',
    alignItems: 'center',
  },
  textContainer: {
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
