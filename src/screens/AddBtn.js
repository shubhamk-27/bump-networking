import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import firestore from '@react-native-firebase/firestore';
//import CountryPicker from 'react-native-country-codes-picker/components/CountryPicker';

import Instagram from '../assets/images/instagram.png';
import Facebook from '../assets/images/facebook.png';
import Whatsapp from '../assets/images/whatsapp.png';
import youtube from '../assets/images/youtube.png';
import snapchat from '../assets/images/snapchat.png';
import twitter from '../assets/images/twitter.png';
import linkedIN from '../assets/images/linkedIN.png';
import clubhouse from '../assets/images/clubHouse.png';
import call from '../assets/images/call.png';
import contact from '../assets/images/contacts.png';
import textMessage from '../assets/images/textMessage.png';
import emailIcon from '../assets/images/email.png';
import location from '../assets/images/location.png';
import customURL from '../assets/images/URL.png';
import Pinterest from '../assets/images/pinterest.png';
import Spotify from '../assets/images/spotify.png';
import Quora from '../assets/images/quora.png';
import Moj from '../assets/images/moj.png';
import Josho from '../assets/images/Josh.png';
import Takatak from '../assets/images/MXTakatak.png';
import Roposo from '../assets/images/Roposo.png';
import DeleteIcon from '../assets/images/delete.png';
import { useUserContext } from '../context/userContext';

const AddBtn = ({ route, navigation }) => {
  const { title, docId, key, } = route.params;
  const { userDetails, getUserDetails } = useUserContext();

  const [link, setLink] = useState('');
  const [editable, setEditable] = useState(true);
  const [SocialMedia, setSocialMedia] = useState([]);
  const [prevLink, setPrevLink] = useState('');
  const [icon, setIcon] = useState(null);
  const [isSocial, setIsSocial] = useState(true);
  const [hint, setHint] = useState('');
  const [verification, setVerification] = useState(true);
  const [persistCode, setPersistCode] = useState(0);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [loading, setLoading] = useState(false);
  const [contactPhNo, setContactPhNo] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const [prevContactPhNo, setPrevContactPhNo] = useState('');
  const [prevContactEmail, setPrevContactEmail] = useState('');

  const saveDetails = async () => {
    // this IF ELSE is to change  editing or saving.
    // in this used two firestore function as in the same delete and adding not working .
    if (verification) {
      setLoading(true);
      let tempSocialMedia = [];
      let persist = false;
      let arrayObj = {};
      let arrayPrevObj = {};
      if (countryCode) {
        arrayPrevObj = {
          title,
          link: prevLink.toString(),
          key,
          countryCode: persistCode.toString(),
        };
        arrayObj = {
          title,
          link: link.toString(),
          key,
          countryCode: countryCode.toString(),
        };
      } else if (title == 'Contact') {
        arrayPrevObj = {
          title,
          link: prevLink.toString(),
          key,
          prevContactEmail,
          prevContactPhNo,
        };
        arrayObj = {
          title,
          link: link.toString(),
          key,
          contactEmail,
          contactPhNo,
        };
      } else {
        arrayPrevObj = { title, link: prevLink.toString(), key };
        arrayObj = { title, link: link.toString(), key };
      }
      console.log(userDetails)
      tempSocialMedia = userDetails.socialMedia ?? [];


      tempSocialMedia.map(item => {
        if (item.title == title) {
          persist = true;

          item.link = link.toString();

          if (countryCode) {
            item.countryCode = countryCode.toString();
          }
          if (item.title == 'Contact') {
            item.contactEmail = contactEmail;
            item.contactPhNo = contactPhNo;
          }
        }
      });
      if (!persist) {
        tempSocialMedia = userDetails.socialMedia;
        tempSocialMedia.push({
          title,
          key,
          link: link.toString(),
          ...(title == 'Contact' && {
            contactEmail,
            contactPhNo,
          }),
          ...(countryCode && {
            countryCode: countryCode.toString(),
          }),
        });
      }

      await firestore()
        .collection('Users')
        .doc(docId)
        .update({
          socialMedia: tempSocialMedia,
        })
        .then(() => {
          console.log('SocialMedia updated!');
          navigation.goBack();
        });
      getUserDetails();
    } else {
      Alert.alert('Email', 'Enter a valid email address', [
        { text: 'OK', onPress: () => null },
      ]);
    }
  };

  const verificationHandler = () => {
    if (title == 'Facebook') {
      try {
        Linking.openURL(link).catch(() => {
          Alert.alert('Warning', 'Enter full Url', [
            { text: 'OK', onPress: () => null },
          ]);
        });
      } catch (error) {
        Alert.alert('Warning', 'Enter full Url', [
          { text: 'OK', onPress: () => null },
        ]);
      }

    }

    else if (['Custom Url', 'Google Maps', 'Spotify', "Linkedin", 'MX TakaTak', 'Roposo', 'Pinterest'].includes(title)
    ) {
      let newLink = link.split('http').pop();
      if (title == 'Custom Url') newLink.toLowerCase();
      try {
        Linking.openURL('http' + newLink).catch(() => {
          Alert.alert('Warning', 'Enter full Url', [
            { text: 'OK', onPress: () => null },
          ]);
        });
      } catch (error) {
        Alert.alert('Warning', 'Enter full Url', [
          { text: 'OK', onPress: () => null },
        ]);
      }
    } else if (title == 'SnapChat') {
      Linking.openURL(`https://www.snapchat.com/add/${link}`);
    } else if (title == 'Text') {
      Linking.openURL(`sms:${countryCode + link}?body= `);
    } else if (title == 'Moj') {
      Linking.openURL(`${link}`);
    } else if (title == 'Quora') {
      Linking.openURL(`${link}`);

    } else if (title == 'ClubHouse') {
      if (link.includes('http')) Linking.openURL(link);
      else Linking.openURL(`https://www.${title.toLowerCase()}.com/${link}`);
    } else {
      Linking.openURL(`https://www.${title.toLowerCase()}.com/${link}`);
    }
  };

  const deleteHandler = async () => {
    let arrayPrevObj = {};
    if (countryCode) {
      arrayPrevObj = {
        title,
        link: prevLink.toString(),
        key,
        countryCode: persistCode.toString(),
      };
    } else {
      arrayPrevObj = {
        title,
        link: prevLink.toString(),
        key,
        ...(contactEmail && { contactEmail, contactPhNo }),
      };
    }

    Alert.alert('Warning', 'Are you sure ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setLoading(true);

          try {
            await firestore()
              .collection('Users')
              .doc(docId)
              .update({
                socialMedia: firestore.FieldValue.arrayRemove(arrayPrevObj),
              })
              .then(() => {
                console.log('deleted');
                getUserDetails();
                setLoading(false);
                navigation.goBack();
              });
          } catch (error) {
            console.log(error, 'error on deleting social data');
            setLoading(false);
          }
        },
      },
    ]);
  };

  const hintSetter = () => {
    switch (title.toLowerCase()) {
      case 'call':
        setHint('Enter your phone number');
        setIsSocial(false);
        setCountryCode('+91');
        break;
      case 'contact':
        setHint('Enter your contact details');
        setIsSocial(false);
        break;
      case 'text':
        setHint('Enter your messaging number');
        setCountryCode(+91);
        setIsSocial(false);
        break;
      case 'email':
        setHint('Enter your email address');
        setIsSocial(false);
        break;
      case 'google maps':
        setHint('Enter your location');

        break;
      case 'custom url':
        setHint('Enter your URL');
        setIsSocial(true);
        break;
      case 'whatsapp':
        setHint('Enter your Whatsapp number');
        setCountryCode('+91');
        setIsSocial(false);
        break;
      case 'snapchat':
        setHint('Enter snapChat ID');
        break;
      default:
        setHint(`Enter ${title} profile Link`);
        break;
    }
  };
  const DeleteBtn = () => {
    return (<TouchableOpacity onPress={() => deleteHandler()} >
      <Image style={{ width: 30, height: 30, tintColor: 'red', }} source={DeleteIcon} />
    </TouchableOpacity>)
  }
  // to hide verify link btn and also seting link on contact buttons.
  useEffect(() => {
    hintSetter();
    // if (isSocial) {
    //     setLink()
    // }
  }, []);
  // to load link if it persist.
  useEffect(async () => {
    userDetails.socialMedia.map(item => {
      if (item.title == title) {
        setLink(item.link);
        setPrevLink(item.link);
        setContactEmail(item?.contactEmail);
        setPrevContactEmail(item?.contactEmail);
        setContactPhNo(item?.contactPhNo);
        setPrevContactPhNo(item?.contactPhNo);
        setCountryCode(item?.countryCode);
        setPersistCode(item?.countryCode);
      }
    });
  }, []);

  // To set Icon accordingly.
  useEffect(() => {
    switch (title) {
      case 'Instagram':
        setIcon(Instagram);
        break;
      case 'Facebook':
        setIcon(Facebook);
        break;
      case 'Whatsapp':
        setIcon(Whatsapp);
        break;
      case 'Youtube':
        setIcon(youtube);
        break;
      case 'SnapChat':
        setIcon(snapchat);
        break;
      case 'Twitter':
        setIcon(twitter);
        break;
      case 'Linkedin':
        setIcon(linkedIN);
        break;
      case 'ClubHouse':
        setIcon(clubhouse);
        break;
      case 'Call':
        setIcon(call);

        break;
      case 'Contact':
        setIcon(contact);
        break;
      case 'Text':
        setIcon(textMessage);
        break;
      case 'Email':
        setIcon(emailIcon);
        break;
      case 'Google Maps':
        setIcon(location);
        break;
      case 'Custom Url':
        setIcon(customURL);
        break;
      case 'Pinterest':
        setIcon(Pinterest);
        break;
      case 'Spotify':
        setIcon(Spotify);
        break;
      case 'Moj':
        setIcon(Moj);
        break;
      case 'Quora':
        setIcon(Quora);
        break;
      case 'MX TakaTak':
        setIcon(Takatak);
        break;
      case 'Roposo':
        setIcon(Roposo);
        break;
      case 'Josh':
        setIcon(Josho);
        break;
      default:
        break;
    }
  }, []);

  // verifyEmail
  useEffect(() => {
    if (title == 'Email') {
      const expression =
        /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

      setVerification(expression.test(String(link).toLowerCase()));
    }
  }, [link]);

  if (loading) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#4784E1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderComponent title1={title} deleteBtn={<DeleteBtn />} />

        {/* position Absolute */}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={styles.iconWrapper}>
              <Image source={icon} style={styles.icon} resizeMode="contain" />
            </View>

            {title != 'Contact' ? (
              <KeyboardAvoidingView style={[styles.inputWrapper]}>
                {countryCode ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShow(true);
                      Keyboard.dismiss();
                    }}
                    style={{
                      paddingBottom: 13,
                      borderBottomColor: 'black',
                      borderBottomWidth: 2,
                      justifyContent: 'flex-end',
                      marginRight: 5,
                      width: 50,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                      }}>
                      {countryCode}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TextInput
                  placeholder={hint}
                  onChangeText={text => {
                    title === 'SnapChat'
                      ? setLink(text.toLowerCase())
                      : setLink(text);
                  }}
                  editable={editable}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { flex: 1 },
                    link && { borderBottomColor: 'black' },
                  ]}
                  defaultValue={link.toString()}
                  keyboardType={countryCode ? 'numeric' : 'default'}
                />
              </KeyboardAvoidingView>
            ) : (
              <KeyboardAvoidingView
                behavior="padding"
                style={[
                  styles.inputWrapper,
                  { flexDirection: 'column', height: 195 },
                ]}>
                <TextInput
                  placeholder={'Enter name'}
                  onChangeText={text => setLink(text)}
                  editable={editable}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { flex: 1 },
                    link && { borderBottomColor: 'black' },
                  ]}
                  defaultValue={link.toString()}
                />
                <TextInput
                  placeholder={'Enter phone number'}
                  onChangeText={text => setContactPhNo(text)}
                  editable={editable}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { flex: 1, marginVertical: 20 },
                    contactPhNo && { borderBottomColor: 'black' },
                  ]}
                  defaultValue={contactPhNo}
                  keyboardType={'numeric'}
                />
                <TextInput
                  placeholder={'Enter your email'}
                  onChangeText={text => setContactEmail(text)}
                  editable={editable}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { flex: 1 },
                    contactEmail && { borderBottomColor: 'black' },
                  ]}
                  defaultValue={contactEmail.toString()}
                />
              </KeyboardAvoidingView>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.btnContainer}>
          {isSocial && (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#474747' }]}
              onPress={verificationHandler}>
              <Text style={[styles.btnText]}>Verify Link</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn} onPress={() => saveDetails()}>
            <Text style={styles.btnText}>{editable ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        {/* <CountryPicker
        show={show}
        keyboardShouldPersistTaps={'always'}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      /> */}
      </View>
    </SafeAreaView>
  );
};

export default AddBtn;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  iconWrapper: {
    height: 121,
    width: 121,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    elevation: 10,
    backgroundColor: 'white',
  },

  icon: {
    width: 60,
    height: 60,
  },
  inputWrapper: {
    paddingTop: 35,

    marginTop: 30,
    flexDirection: 'row',
  },
  input: {
    color: '#383838',
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
  },
  btnContainer: {
    flex: 0.1,
    justifyContent: 'flex-end',
  },
  btn: {
    marginVertical: 10,
    width: 335,
    height: 50,
    backgroundColor: '#474747',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4784E1',
    borderRadius: 50,
    elevation: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },
  WarningDot: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#FF5252',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
