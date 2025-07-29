import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/core';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Linking,
  StyleSheet,
} from 'react-native';

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

const ContactBtn = ({item, docId, email, cat, alreadyPresent}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const focussed = useIsFocused();

  const [icon, setIcon] = useState(item.icon);

  const SocialMediaBtnClickHandler = () => {
    navigation.navigate('AddBtn', {
      title: item.title,
      icon: item.icon,
      docId,
      key: item.key,
      cat,
    });
  };

  useEffect(() => {
    switch (item.title) {
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

  // this is to findout if link already present...
  useEffect(async () => {
    try {
      await firestore()
        .collection('Users')

        .doc(docId)
        .get()
        .then(docSnapShot => {
          let SocialMedia = docSnapShot?.data()?.socialMedia;
          let socialItem = [];

          if (SocialMedia) {
            socialItem = SocialMedia.filter(item1 => item1.title == item.title);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [focussed]);
  return (
    <View style={{width: width / 4, alignItems: 'center'}}>
      <TouchableOpacity
        style={{width: 80, alignItems: 'center', marginTop: 10}}
        onPress={() => SocialMediaBtnClickHandler()}>
        <View
          style={[
            styles.iconWrapper,
            {borderColor: alreadyPresent ? 'green' : 'white', borderWidth: 1},
          ]}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </View>

        <Text style={styles.name}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactBtn;

const styles = StyleSheet.create({
  iconWrapper: {
    width: 63,
    height: 63,
    backgroundColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 33,
    height: 33,
  },
  name: {
    fontSize: 10,
    lineHeight: 22,
  },
});
