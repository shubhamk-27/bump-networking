import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import OnboardingItem from '../components/OnboardingItem';
import OnBoardingPaginater from '../components/OnBoardingPaginater';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import Video1 from '../assets/videos/onBoarding.mp4';
import Video2 from '../assets/videos/onBoarding2.mp4';
import Video3 from '../assets/videos/onBoarding3.mp4';
import {SafeAreaView} from 'react-native-safe-area-context';

const OnBoarding1 = ({navigation}) => {
  const [currentOnboarding, setCurrentOnboarding] = useState(0);

  // setting  inf. about current section.
  const scrollX = useRef(new Animated.Value(0)).current;

  console.log(scrollX);

  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentOnboarding(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const buttonHandler = () => {
    if (currentOnboarding < slides.length - 1) {
      slidesRef.current.scrollToIndex({index: currentOnboarding + 1});
    } else {
      console.log('Last item');
    }
  };

  const slides = [
    {
      id: 0,
      video: Video1,
      text: `One-tap solution for all your business and personal networking.`,
    },
    {
      id: 1,
      video: Video2,
      text: 'Unskeptical way of connecting with people.',
    },
    {
      id: 2,
      video: Video3,
      text: 'Privacy mode will allow you to protect your confidential information.',
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#e9e7e9"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        barStyle={'dark-content'}
        hidden={false}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          {currentOnboarding != slides.length - 1 && (
            <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
              <Text style={{fontSize: 15, marginTop: 10}}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{height: '78%'}}>
          <FlatList
            style={{padding: 0, margin: 0, marginTop: 30}}
            pagingEnabled
            bounces={false}
            data={slides}
            renderItem={item => <OnboardingItem item={item} />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <OnBoardingPaginater data={slides} scrollX={scrollX} />
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor:
                  currentOnboarding == slides.length - 1
                    ? '#4784E1'
                    : '#4784E133',
              },
            ]}
            onPress={() =>
              currentOnboarding == slides.length - 1
                ? navigation.replace('Welcome')
                : buttonHandler()
            }>
            <Text
              style={[
                styles.btnText,
                {
                  color:
                    currentOnboarding == slides.length - 1 ? 'white' : 'black',
                },
              ]}>
              {currentOnboarding == slides.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding1;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e9e7e9',
  },
  header: {
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
    height: 40,
  },
  btnContainer: {
    alignItems: 'flex-end',
    paddingRight: 30,
    height: '15%',
    justifyContent: 'center',
  },
  btn: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    backgroundColor: '#4784E133',
    height: 50,
    borderRadius: 50,
  },
  btnText: {
    fontSize: RFValue(18, 640),
    fontWeight: '500',
  },
});
