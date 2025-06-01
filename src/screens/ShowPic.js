import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const ShowPic = ({route}) => {
  const {imageUrl} = route.params;
  const {profileImage} = route.params;

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.img} />
      ) : (
        <Image source={profileImage} style={styles.img} />
      )}
    </View>
  );
};

export default ShowPic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
