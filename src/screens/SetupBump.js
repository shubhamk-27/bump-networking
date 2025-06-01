import React, { useState, useEffect, useLayoutEffect, } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ActivityIndicator,

} from 'react-native';
import NfcManager, {
  NfcTech,
  Ndef,
} from 'react-native-nfc-manager';
import firestore from '@react-native-firebase/firestore';
import HeaderComponent from '../components/HeaderComponent';
import successImage from '../assets/images/congratulations.png';
import readyImage from '../assets/images/ready_to_scan.png';
import { useUserContext } from '../context/userContext';


const SetupBump = ({ navigation, route }) => {


  const { userDetails } = useUserContext()

  const [success, setSuccess] = useState(false);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);

  async function initNfc() {
    await NfcManager.start();
  }


  // check whether NFC on or not.
  useEffect(() => {
    if (Platform.OS === 'ios') {
      initNfc();
      readData();
    } else {
      NfcManager.isSupported().then(async supported => {

        if (supported) {
          NfcManager.isEnabled().then(enabled => {
            console.log(enabled);
            if (enabled) {
              initNfc();
              readData();
            } else {
              Alert.alert(
                'Turn on NFC',
                'Your NFC is OFF, click Enable to turn on',
                [

                  ...(route.params?.from == 'setupProfile' && {
                    text: 'Skip',
                    onPress: () => navigation.navigate('BottomNav'),
                    style: 'cancel',
                  }),

                  {
                    text: 'Enable',
                    onPress: () => {
                      navigation.goBack();
                      NfcManager.goToNfcSetting();
                    },
                  },
                ],
              );
            }
          });
        } else {
          Alert.alert('Not supported', "Your device don't support NFC tags.", [
            // {
            //   text: 'Cancel',
            //   onPress: () => console.log('Cancel Pressed'),
            //   style: 'cancel',
            // },
            {
              text: 'Proceed',
              onPress: () => {
                navigation.navigate('BottomNav');
              },
            },
          ]);
        }
      });
    }




  }, []);

  const showAlert = (type) => {
    Alert.alert(
      'Error',
      type == 'Verification' ? 'Specified tag is not Bump verified.' :
        'Tag already taken by other user.',

      [
        {
          text: 'Retry',
          onPress: () => readData(),
          style: 'cancel',
        },

      ],
    );
  }

  const updateDataHandler = async (tagId) => {
    let id;
    let docID;
    await firestore()
      .collection('dataEntry')
      .where('id', '==', tagId)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot.empty) {
          return showAlert('Verification')
        }

        else {
          querySnapshot.forEach(doc => {

            if (doc.data().name) {
              return showAlert('configured')
            } else {
              id = doc._data.id
              docID = doc.id
            }


          })


          // updating data to db

          await firestore()
            .collection('dataEntry')
            .doc(docID)
            .update({
              name: userDetails.username
            }).then(() => {
              setSuccess(true)
              setTimeout(() => {
                navigation.navigate('BottomNav', { screen: 'Home' });
              }, 3000)
            })
        }

      });
  }


  async function writeNdef() {
    let result = false;

    try {

      // Step 1
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some NDEF',
      });

      const bytes = Ndef.encodeMessage([
        Ndef.uriRecord(`https://bumpme.in/${id}`),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler // Step2
          .writeNdefMessage(bytes); // Step3

        if (Platform.OS === 'ios') {
          await NfcManager.setAlertMessageIOS('Successfully write NDEF');
        }
      }

      result = true;
    } catch (ex) {
      console.log(ex);
      console.log('ok2');
    }

    // // Step 4
    NfcManager.cancelTechnologyRequest().catch(() => 0);
    setSuccess(result);
    if (route.params?.from == 'setupProfile') {
      setTimeout(() => { navigation.navigate('BottomNav') }, 3000);
    }

  }

  const readData = async () => {

    let tag = null;

    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);

      tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();

      // if (Platform.OS === 'ios') {
      //   await NfcManager.setAlertMessageIOS('Success');
      // }


      console.log('tagDetails', tag)


    } catch (ex) {
      // for tag reading, we don't actually need to show any error
      console.log(ex);
      return
    } finally {
      NfcManager.cancelTechnologyRequest();
      updateDataHandler(tag.id)
    }


  };


  if (loading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#4784E1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title1={'Setup Bump'} skip  />
      {success ? (
        <>
          <Text style={styles.title}>Congratulations!</Text>
          <Image source={successImage} style={styles.icon} />
          <Text style={styles.text}>Your Bump has been setup.</Text>
        </>
      ) : (
        <>
       
          <Text style={styles.title}>Ready to Scan</Text>
          <Image source={readyImage} style={styles.icon} />
          <Text style={styles.text}>
            Hold a Bump tag at the middle of the back {'\n'}
            of your phone to view profile. Hold the {'\n'}
            Bump there until the profile appears.
          </Text>
        </>
      )}
    </SafeAreaView>
  );
};

export default SetupBump;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  title: {
    marginTop: 67,
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: '500',
  },
  icon: {
    marginTop: 39,
    width: 131,
    height: 131,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 50,
  },
});