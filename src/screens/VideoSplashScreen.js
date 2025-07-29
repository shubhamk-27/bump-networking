import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import Video from 'react-native-video';
import video from '../assets/videos/openingVideo.mp4';
const VideoSplashScreen = ({setOpening}) => {
  const {width, height} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={video}
          style={{width, height: width, left: -5}}
          onBuffer={() => console.log('buffer')} // Callback when remote video is buffering
          onError={() => console.log('b1')}
          // ref={(ref) => { reg = ref }}
          resizeMode={'contain'}
          onEnd={() => {
            setOpening(false);
          }}
        />
      </View>
    </View>
  );
};

export default VideoSplashScreen;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#e9e7e9',
  },
  videoContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
