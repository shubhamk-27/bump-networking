import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import auth from '@react-native-firebase/auth';

const HeaderComponent = ({
  title1,
  title2,
  backBtn,
  noBackBtn,
  deleteBtn,
  skip,
}) => {
  const navigation = useNavigation();

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
      <View style={styles.header}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'white',
            borderRadius: 24,
            alignItems: 'center',
            marginLeft: 10,
          }}>
          {!noBackBtn && (
            <TouchableOpacity onPress={() => backBtnHandler()}>
              <Image
                style={styles.headerImg}
                source={require('../assets/images/back.png')}
              />
            </TouchableOpacity>
          )}
        </View>

        <View>
          <Text style={styles.headerText}>{title1}</Text>
          {title2 && <Text style={styles.headerText}>{title2}</Text>}
        </View>
        <View style={styles.deleteBtnWrpr}>{deleteBtn && deleteBtn}</View>
        {skip && (
          <Text
            style={{fontSize: 15, marginRight: 10}}
            onPress={() => navigation.navigate('BottomNav')}>
            Skip
          </Text>
        )}
      </View>
    </View>
  );
};

export default HeaderComponent;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImg: {
    width: 30,
    height: 30,
    marginTop: 4,
  },
  headerText: {
    marginLeft: 30,
    fontSize: 22,
  },
  deleteBtnWrpr: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },
});
