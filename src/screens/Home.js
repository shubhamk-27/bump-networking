import React, {useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Linking,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
  Alert,
  SafeAreaView,
} from 'react-native';
import {DraggableGrid} from 'react-native-draggable-grid';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useIsFocused} from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';

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
import AccountIcon from '../assets/images/account.png';
import Pinterest from '../assets/images/pinterest.png';
import Spotify from '../assets/images/spotify.png';
import Quora from '../assets/images/quora.png';
import Moj from '../assets/images/moj.png';
import Josho from '../assets/images/Josh.png';
import Takatak from '../assets/images/MXTakatak.png';
import Roposo from '../assets/images/Roposo.png';

import InstaGray from '../assets/images/Instagram(grayscale).png';
import FbGray from '../assets/images/Facebook(grayscale).png';
import LinkedInGray from '../assets/images/LinkedIn(grayscale).png';
import SnapGray from '../assets/images/SnapChat(grayscale).png';
import TwitterGray from '../assets/images/Twitter(grayscale).png';
import YoutubeGray from '../assets/images/YouTube(grayscale).png';
import WTspGray from '../assets/images/WhatsApp(grayscale).png';
import ClubHouseGray from '../assets/images/Clubhouse(grayscale).png';
import CallGray from '../assets/images/Call(grayscale).png';
import ContactGray from '../assets/images/Contact(grayscale).png';
import EamilGray from '../assets/images/Email(grayscale).png';
import LocationGray from '../assets/images/Maps(grayscale).png';
import MojGray from '../assets/images/Moj(grayscale).png';
import PinterestGray from '../assets/images/pinterest_dark.png';
import QuoraGray from '../assets/images/quora_dark.png';
import RoposoGray from '../assets/images/Roposo(grayscale).png';
import SpotifyGray from '../assets/images/spotify_dark.png';
import TextGRay from '../assets/images/Text(grayscale).png';
import URLGray from '../assets/images/URL(grayscale).png';
import JoshGray from '../assets/images/Josh(grayscale).png';
import TakTakGray from '../assets/images/MXTakatak(grayscale).png';
import {useUserContext} from '../context/userContext';

const Home = ({navigation}) => {
  const focussed = useIsFocused();

  const {width} = useWindowDimensions();

  const {userDetails, globalLoading} = useUserContext();

  const [profileON, setProfileON] = useState();
  const [isDirect, setIsDirect] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [username, setUsername] = useState();
  const [publicUsername, setPublicUsername] = useState();
  const [editable, setEditable] = useState(false);
  const [docId, setDocId] = useState();
  const [profImgExtension, setProfImgExtension] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(globalLoading);
  const [designation, setDesignation] = useState('');
  const [disableScroll, setDisableScroll] = useState(false);

  const toggleOptions = [
    {label: 'Profile OFF', value: false},
    {label: 'Profile ON', value: true},
  ];

  // to set icon of buttons accordingly
  const RenderButton = (item, index) => {
    let icon;
    let grayIcon;
    switch (item.title) {
      case 'Instagram':
        icon = Instagram;
        grayIcon = InstaGray;
        break;
      case 'Facebook':
        icon = Facebook;
        grayIcon = FbGray;
        break;
      case 'Whatsapp':
        icon = Whatsapp;
        grayIcon = WTspGray;
        break;
      case 'Youtube':
        icon = youtube;
        grayIcon = YoutubeGray;
        break;
      case 'SnapChat':
        icon = snapchat;
        grayIcon = SnapGray;
        break;
      case 'Twitter':
        icon = twitter;
        grayIcon = TwitterGray;
        break;
      case 'Linkedin':
        icon = linkedIN;
        grayIcon = LinkedInGray;
        break;
      case 'ClubHouse':
        icon = clubhouse;
        grayIcon = ClubHouseGray;
        break;
      case 'Call':
        icon = call;
        grayIcon = CallGray;
        break;
      case 'Contact':
        icon = contact;
        grayIcon = ContactGray;
        break;
      case 'Text':
        icon = textMessage;
        grayIcon = TextGRay;
        break;
      case 'Email':
        icon = emailIcon;
        grayIcon = EamilGray;
        break;
      case 'Google Maps':
        icon = location;
        grayIcon = LocationGray;
        break;
      case 'Custom Url':
        icon = customURL;
        grayIcon = URLGray;
        break;
      case 'Pinterest':
        icon = Pinterest;
        grayIcon = PinterestGray;
        break;
      case 'Spotify':
        icon = Spotify;
        grayIcon = SpotifyGray;
        break;
      case 'Moj':
        icon = Moj;
        grayIcon = MojGray;
        break;
      case 'Quora':
        icon = Quora;
        grayIcon = QuoraGray;
        break;
      case 'MX TakaTak':
        icon = Takatak;
        grayIcon = TakTakGray;
        break;
      case 'Roposo':
        icon = Roposo;
        grayIcon = RoposoGray;
        break;
      case 'Josh':
        icon = Josho;
        grayIcon = JoshGray;
        break;
      default:
        break;
    }
    return (
      <View style={{width: width / 4, alignItems: 'center'}}>
        <View style={{width: 80, alignItems: 'center', marginTop: 10}}>
          <View
            style={[
              styles.iconWrapper,
              isDirect &&
                index != 0 && {
                  backgroundColor: '#F6F6F6',
                  elevation: 0,
                  borderWidth: 0,
                },
            ]}>
            <Image
              source={isDirect && index != 0 ? grayIcon : icon}
              style={[styles.icon]}
              resizeMode="contain"
            />
          </View>

          <Text style={{fontSize: 10}}>{item.title}</Text>
        </View>
      </View>
    );
  };

  // update whether profile on or off.
  const updateProfStatus = async value => {
    console.log('status');
    Alert.alert(
      'Warning',
      `Are you sure you want to turn profile  ${profileON ? 'OFF' : 'ON'} ?`,
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setProfileON(value);

            await firestore()
              .collection('Users')
              .doc(docId)
              .update({
                profStatus: !profileON,
              })
              .then(() => {
                console.log('ProfileStatusUpdated');
              });
          },
        },
      ],
    );
  };

  // to set direct status to database
  const directHandler = async value => {
    setIsDirect(value);

    await firestore()
      .collection('Users')
      .doc(docId)
      .update({
        direct: !isDirect,
      })
      .then(() => {
        console.log('direct updated');
      });
  };

  // to update new order of btns to database
  const dragReleaseHandler = async data => {
    setDisableScroll(false)
    setSocialMediaData(data);
    console.log(data);

    await firestore()
      .collection('Users')
      .doc(docId)
      .update({
        socialMedia: [...data],
      })
      .then(() => {
        console.log('social media updated');
      });
  };

  // Get user details
  useEffect(async () => {
    setLoading(true);

    let email1 = auth().currentUser.email;

    try {
      await firestore()
        .collection('Users')
        // Filter results
        .where('email', '==', email1)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            setPublicUsername(doc._data.publicUsername);
            setProfImgExtension(doc._data.profImgExtension);
            setUsername(doc._data.username);
            setDocId(doc.id);
            setEmail(doc._data.email);
            setIsDirect(doc._data.direct);
            setDesignation(doc._data?.designation);

            if (doc._data.profStatus != undefined) {
              setProfileON(doc._data.profStatus);
            }
            if (doc._data.socialMedia != undefined) {
              setSocialMediaData(doc._data.socialMedia);
            }
          });

          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, [focussed]);
  const SocialMediaBtnClickHandler = item => {
    // if (item.title == 'Email') {
    //   Linking.openURL(`mailto:${email}`);
    // } else {
    navigation.navigate('AddBtn', {
      title: item.title,
      icon: item.icon,
      docId,
      key: item.key,
    });
    // }
  };

  // Get profilePic
  useEffect(async () => {
    try {
      let imageRef = username + '.' + profImgExtension;
      const url = await storage().ref(imageRef).getDownloadURL();
      setImageUrl(url);
    } catch (error) {
      if (focussed) {
        setImageUrl('');
        console.log(error);
      }
    }
  }, [username, focussed]);

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
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.selectorContainer}>
          <View
            style={{
              position: 'absolute',
              top: -width * 2.44,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 3 * width,
                height: 3 * width,
                backgroundColor: 'rgba(85, 142, 227, 0.2)',
                borderRadius: 620,
              }}></View>
          </View>

          <Pressable
            onPress={() => updateProfStatus(!profileON)}
            style={styles.selectorContainer}>
            <View
              style={[
                styles.selectorBar,
                profileON && {
                  alignItems: 'flex-end',
                  backgroundColor: '#C6FFAB',
                },
              ]}>
              <View style={styles.selectorBtn}>
                <Text style={{fontSize: 12}}>
                  Profile {profileON ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.profWrpr}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <View style={styles.profPicWrpr}>
              {imageUrl ? (
                <Image source={{uri: imageUrl}} style={styles.profilePic} />
              ) : (
                <Image source={AccountIcon} style={{height: 30, width: 30}} />
              )}
            </View>
            <View style={styles.userTxtWrpr}>
              <Text style={{fontSize: 10, color: 'gray'}}>Public Username</Text>
              <Text style={(styles.username, {color: 'black'})}>
                {publicUsername}
              </Text>
              <Text style={styles.username}>{designation}</Text>
            </View>
          </View>

          <Text style={styles.url}>{'bumpme.in/' + username}</Text>
        </View>

        <View style={styles.directContainer}>
          <Text style={styles.direct}>Instant</Text>
          <ToggleSwitch
            isOn={isDirect}
            onColor="#C6FFAB"
            offColor="#C4C4C4"
            size="medium"
            onToggle={value => directHandler(value)}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.socialBtnContainer}
          scrollEnabled={!disableScroll}>
          <DraggableGrid
            numColumns={4}
            renderItem={RenderButton}
            data={socialMediaData}
            onDragRelease={data => {
              dragReleaseHandler(data);
              // need reset the props data sort after drag release
            }}
            onItemPress={item => SocialMediaBtnClickHandler(item)}
            onDragStart={() => setDisableScroll(true)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    // alignItems: 'center'
  },
  selectorContainer: {
    height: 70,
    width: 152,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  selectorBar: {
    height: 18,
    width: 180,
    borderRadius: 25,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation: 5,
  },
  selectorBtn: {
    height: 33,
    width: 80,
    borderRadius: 25,
    elevation: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profWrpr: {
    marginTop: 30,
    alignSelf: 'center',
    width: 320,
    height: 179,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: 'rgba(158, 158, 158, 0.25)',
    elevation: 5,
  },
  profPicWrpr: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
    borderRadius: 1000,
    borderColor: 'rgba(158, 158, 158, 0.25)',
  },
  profilePic: {
    height: 120,
    width: 120,
    borderRadius: 90,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#383838',
    // resizeMode:'contain'
  },
  url: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.5,
    marginTop: 140,
    alignSelf: 'center',
    marginTop: 2,
  },
  userTxtWrpr: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  username: {
    fontSize: 13,
    color: '#6E6E6E',
  },

  usernameWrapper: {
    width: '100%',
    paddingTop: 35,
  },

  directContainer: {
    height: 50,
    width: '100%',
    marginTop: 50,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  direct: {
    fontSize: 17,
  },
  socialBtnContainer: {
    paddingVertical: 15,
    width: '100%',
  },
  iconWrapper: {
    width: 63,
    height: 63,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    marginTop: 18,
    borderWidth: 0.5,
    borderColor: '#9E9E9E',
  },
  icon: {
    width: 33,
    height: 33,
  },
});
