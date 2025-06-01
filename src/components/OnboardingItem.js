import React, { useRef } from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Video from 'react-native-video';

const OnboardingItem = ({ item }) => {
    const { width } = useWindowDimensions();
    const ref = useRef()

    const { video, text } = item.item

    return (
        <View style={styles.container} >

            <View style={styles.videoContainer} >

                <Video source={video}
                    style={{ width, height: width, left: -5 }}
                    onBuffer={() => console.log('buffer')}                // Callback when remote video is buffering
                    onError={() => console.log('b1')}
                    ref={(ref) => { ref = ref }}
                    resizeMode={'contain'}
                    repeat={true}
                />
                <View style={{ ...styles.txtWrpr, width: width -50, }} >
                    <Text style={{ textAlign: 'center', fontSize: 18 }} >{text}</Text>
                </View>
            </View>

        </View>
    )
}

export default OnboardingItem
const styles = StyleSheet.create({
    container: {
    },
    videoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtWrpr: {
    }



})