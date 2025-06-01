import LottieView from 'lottie-react-native';
import React from 'react';
import {View, Text} from 'react-native';

const SplashScreen = ({onAnimationFinish}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#4784E1'}}>
      <LottieView
        source={require('../assets/splashScreen/BUMP json.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

export default SplashScreen;
