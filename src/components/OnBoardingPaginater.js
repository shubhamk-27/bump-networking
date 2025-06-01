import React from 'react'
import { View, Animated, StyleSheet, useWindowDimensions } from 'react-native'

const OnBoardingPaginater = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();
    return (
        <View style={styles.container} >

            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp'
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                })
                return (

                    <Animated.View key={i} style={[styles.dot, { opacity }]} />


                )
            })}
        </View>
    )
}

export default OnBoardingPaginater

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 12,


    },
    dot: {
        height: 12,
        width: 12,
        borderRadius: 100,
        backgroundColor: '#4784E1',
        marginHorizontal: 8,
       

    }
})