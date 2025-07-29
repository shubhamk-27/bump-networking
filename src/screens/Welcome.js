import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  StatusBar,
} from 'react-native';

import Logo from '../assets/images/bump_logo.png';

const Welcome = ({navigation}) => {
  useEffect(async () => {
    try {
      await AsyncStorage.setItem('isInitiated', 'initiated');
    } catch (e) {
      // saving error
      console.log(e, 'error saving to async storage');
    }
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        animated={true}
        backgroundColor="white"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        barStyle={'dark-content'}
        hidden={false}
      />
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Image source={Logo} style={styles.logo} />
        </View>
      </View>

      <View styles={styles.btnContaner}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: 'white'}}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#000000'}]}
          onPress={() => Linking.openURL('https://shop.bumpme.in')}>
          <Text style={{color: '#fff'}}>Buy Bump</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Already have an account?</Text>

        <Text style={styles.login} onPress={() => navigation.navigate('Login')}>
          Log In
        </Text>
      </View>
    </View>
  );
};

export default Welcome;
const styles = StyleSheet.create({
  container: {},
  iconContainer: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4281E0',
    borderRadius: 100,
  },
  logo: {
    width: 175,
    resizeMode: 'contain',
  },
  btnContaner: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4784E1',
    marginVertical: 15,
    marginHorizontal: 20,

    elevation: 20,
  },
  text: {
    marginTop: 10,
    alignSelf: 'center',
  },
  login: {
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
});
