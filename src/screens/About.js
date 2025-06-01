import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const About = () => {
    return (
        <View style={styles.container} >
            <Text style={styles.title} >Bump</Text>
            <View style={styles.wrpr_1} >
                <Text>Bump is a one-tap solution for all your business and personal networking.</Text>
                <Text>BUMP is a NFC based digital business card which carries your information to be shared with just a tap!
                    check.
                </Text>
            </View>
            <View style={styles.wrpr_2} >
                <Text>- A single product for all your business and social connections.</Text>
                <Text>- The fastest and most secure way to share any of your social links.</Text>
                <Text>- Get a BUMP, Configure it using our app and you’re all set.</Text>
            </View>
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        padding: 30,
        paddingTop: 150,
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },
    title: {
        fontSize: 25
    },
    wrpr_1: {
        marginTop: 20,
    },
    wrpr_2: {
        marginTop: 20,
        paddingLeft: 10
    }
})