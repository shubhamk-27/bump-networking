import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const AuthHeader = ({title1, title2, backBtn, noBackBtn}) => {
  const navigation = useNavigation();

  const {width} = useWindowDimensions();

  const logout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const backBtnHandler = () => {
    if (backBtn == 'logout') {
      logout();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          width: 3 * width,
          height: 3 * width,
          left: -width,
          top: -width * 2.52,
          backgroundColor: '#DDE8F9',
          borderRadius: 620,
        }}></View>
      <View style={styles.header}>
        {!noBackBtn && (
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'white',
              borderRadius: 24,
              paddingLeft: 4,
              marginLeft: 10,
              elevation: 5,
              marginTop: Platform.OS === 'ios' ? 10 : 0,
            }}>
            <TouchableOpacity onPress={() => backBtnHandler()}>
              <Image
                style={styles.headerImg}
                source={require('../assets/images/back.png')}
              />
            </TouchableOpacity>
          </View>
        )}
        {noBackBtn && (
          <View
            style={{
              width: 40,
              height: 40,
            }}></View>
        )}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.headerText}>{title1}</Text>
          {title2 && <Text style={styles.headerText}>{title2}</Text>}
        </View>
      </View>
    </View>
  );
};

export default AuthHeader;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 200,
  },
  headerImg: {
    width: 30,
    height: 30,
    marginTop: 4,
  },
  headerText: {
    marginLeft: -90,
    fontSize: 22,
    fontWeight: '500',
  },
});
