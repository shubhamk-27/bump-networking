import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const QRScanner = () => {
  const [username, setUsername] = useState();

  let QRSVG = useRef();

  const {width} = useWindowDimensions();

  const shareHandler = async () => {
    // QRSVG.toDataURL(dataURL => {

    // });
    let shareImageBase64 = {
      title: 'Bump App',
      message: `Connect with me ${'\n'}https://bumpme.in/${username}`,
      // url: `data:image/png;base64,${dataURL}`,
      subject: 'Bump App link QR Code', //  for email
    };
    Share.open(shareImageBase64).catch(error => console.log(error));
  };

  // Get user details
  useEffect(async () => {
    let {email} = auth().currentUser;
    let tempUsername = '';

    try {
      await firestore()
        .collection('Users')
        // Filter results
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            tempUsername = doc._data.username;
          });
        })
        .then(() => {
          setUsername(tempUsername);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode
          value={`https://bumpme.in/${username}`}
          size={width * 0.75}
          getRef={svg => (QRSVG = svg)}
        />
      </View>
      <Text style={styles.url}>{'bumpme.in/' + username}</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => shareHandler()}>
          <Text style={styles.btnText}>Share Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QRScanner;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
  },
  qrContainer: {
    paddingTop: 40,
    width: 293,

    alignItems: 'center',
    justifyContent: 'center',
  },
  url: {
    fontSize: 18,
    lineHeight: 22,
    color: 'black',
    opacity: 0.5,
    marginTop: 50,
  },
  btnContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  btn: {
    height: 60,
    marginHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4784E1',
    borderColor: '#383838',
    borderRadius: 30,
  },
  btnText: {
    color: 'white',
    fontSize: 17,
  },
});
