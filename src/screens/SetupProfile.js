import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import HeaderComponent from '../components/HeaderComponent';
import Icon from '../assets/images/sample.png';
import ContactBtn from '../components/ContactBtn';
import camera from '../assets/images/cameraa.png';
import gallery from '../assets/images/galleryy.png';
import editPen from '../assets/images/Editicon.png';
import accountIcon from '../assets/images/account.png';
import XIco from '../assets/images/x.png';
import DeleteIco from '../assets/images/delete.png';

import {useIsFocused} from '@react-navigation/core';
import {useUserContext} from '../context/userContext';

const SetupProfile = ({navigation, route}) => {
  const fromSettings = route.params?.fromSettings;
  const isFocussed = useIsFocused();
  const {getUserDetails} = useUserContext();

  const [publicUsername, setPublicUsername] = useState('');
  const [editable, setEditable] = useState(false);
  const [docId, setDocId] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState('');
  const [profImgExtension, setProfImgExtension] = useState('.png');
  const [imageUrl, setImageUrl] = useState();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profStatus, setProfStatus] = useState(true);
  const [direct, setDirect] = useState(false);
  const [info, setInfo] = useState([]);
  const [designation, setDesignation] = useState('');
  const [socialMedia, setSocialMedia] = useState([]);

  const socialMediaComps = [
    {title: 'Instagram', icon: Icon, key: 'one'},
    {title: 'Facebook', icon: Icon, key: 'two'},
    {title: 'Whatsapp', icon: Icon, key: 'three'},
    {title: 'Youtube', icon: Icon, key: 'four'},
    {title: 'SnapChat', icon: Icon, key: 'five'},
    {title: 'Twitter', icon: Icon, key: 'six'},
    {title: 'Linkedin', icon: Icon, key: 'seven'},
    {title: 'Pinterest', icon: Icon, key: 'eight'},
    {title: 'Spotify', icon: Icon, key: 'fifteen'},
    {title: 'Moj', icon: Icon, key: 'Sixteen'},
    {title: 'Quora', icon: Icon, key: 'Seventeen'},
    {title: 'MX TakaTak', icon: Icon, key: 'Eighteen'},
    {title: 'Roposo', icon: Icon, key: 'Nineteen'},
    {title: 'Josh', icon: Icon, key: 'Twenty'},
    {title: 'ClubHouse', icon: Icon, key: 'Twentyone'},
  ];

  const contactDetails = [
    {title: 'Call', icon: Icon, key: 'nine'},
    {title: 'Contact', icon: Icon, key: 'ten'},
    {title: 'Text', icon: Icon, key: 'eleven'},
    {title: 'Email', icon: Icon, key: 'twelve'},
    {title: 'Google Maps', icon: Icon, key: 'thirteen'},
    {title: 'Custom Url', icon: Icon, key: 'fourteen'},
  ];

  const imagePicker = type => {
    if (type == 'gallery') {
      ImagePicker.clean().catch(e => {
        console.log(e);
      });
      ImagePicker.openPicker({
        width: 900,
        height: 1200,
        cropping: true,
      }).then(image => {
        setModalVisible(false);
        setProfileImage({uri: image.path});

        profPicUpload(image.path).then(async () => {
          await firestore()
            .collection('Users')
            .doc(docId)
            .update({
              profImgExtension: image.path
                ? image.path.substr(image.path.lastIndexOf('.') + 1)
                : profImgExtension,
            })
            .then(() => {
              console.log('Photo updated!');
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              console.log(error);
            });
        });
      });
    } else {
      ImagePicker.clean().catch(e => {
        console.log(e);
      });
      ImagePicker.openCamera({
        width: 900,
        height: 1200,
        cropping: true,
      }).then(image => {
        setModalVisible(false);
        setProfileImage({uri: image.path});
        profPicUpload(image.path).then(async () => {
          await firestore()
            .collection('Users')
            .doc(docId)
            .update({
              profImgExtension: profileImage
                ? profileImage.uri.substr(image.path.lastIndexOf('.') + 1)
                : profImgExtension,
            })
            .then(() => {
              console.log('Photo updated!');
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              console.log(error);
            });
        });
      });
    }
  };

  const requestCameraPermission = async type => {
    if (Platform.OS === 'ios') {
      // because ios not need permissions asking
      return imagePicker(type);
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Give permission to use Camera',
          message: 'Bump needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        imagePicker(type);
      } else {
        Alert.alert('Warning', 'Bump needs access to your camera ', [
          {
            text: 'Okay',
            onPress: () => null,
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    // add profile pic to storage
    // to add public username to firestore

    await firestore()
      .collection('Users')
      .doc(docId)
      .update({
        publicUsername,
        profStatus,
        direct,
        designation,
      })
      .then(() => {
        console.log('User updated!');
        if (fromSettings) {
          navigation.navigate('BottomNav', {screen: 'Home'});
        } else {
          navigation.navigate('SetupBump', {from: 'setupProfile'});
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const profPicUpload = async uri => {
    let extension = uri.substr(uri.lastIndexOf('.') + 1);
    let filename = username + '.' + extension;

    await storage().ref(filename).putFile(uri);
  };

  const deleteProfPic = async () => {
    try {
      let imageRef = username + '.' + profImgExtension;
      const url = await storage().ref(imageRef).delete();
      setImageUrl('');
      setProfileImage('');
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    firestore()
      .collection('Users')
      // Filter results
      .onSnapshot(snapshot =>
        setInfo(snapshot?.docs.map(doc => ({id: doc.id, info: doc.data()}))),
      );
  }, []);
  // To get username
  useEffect(() => {
    setLoading(true);
    let {email} = auth().currentUser;
    console.log(email);
    firestore()
      .collection('Users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setPublicUsername(doc._data.username);
          setProfImgExtension(doc._data.profImgExtension);
          setUsername(doc._data.username);
          setDocId(doc.id);

          if (doc._data.publicUsername) {
            setPublicUsername(doc._data.publicUsername);
          }
          if (doc._data.profStatus) {
            setProfStatus(doc._data.profStatus);
          }
          if (doc._data.direct) {
            setDirect(doc._data.direct);
          }
          if (doc._data.designation) {
            setDesignation(doc._data?.designation);
          }
          if (doc._data.socialMedia) setSocialMedia(doc._data.socialMedia);
        });
        setLoading(false);
      });
  }, [isFocussed]);

  // Get profilePic
  useEffect(async () => {
    try {
      let imageRef = username + '.' + profImgExtension;
      const url = await storage().ref(imageRef).getDownloadURL();
      setImageUrl(url);
    } catch (error) {
      console.log(error);
    }
  }, [username]);

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <HeaderComponent
          title1={'Setup Profile'}
          backBtn={fromSettings ? 'back' : 'logout'}
          noBackBtn={fromSettings ? false : true}
        />

        <View style={styles.imageContainer}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profImgWrapper}>
              {imageUrl || profileImage ? (
                profileImage ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ShowPic', {profileImage})
                    }>
                    <Image
                      source={profileImage}
                      style={
                        ([styles.profileImage],
                        {height: 90, width: 90, borderRadius: 100})
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ShowPic', {imageUrl})}>
                    <Image
                      source={{uri: imageUrl}}
                      style={
                        ([styles.profileImage],
                        {height: 100, width: 100, borderRadius: 100})
                      }
                    />
                  </TouchableOpacity>
                )
              ) : (
                <Image source={accountIcon} style={styles.profileImage} />
              )}
            </View>
            <View style={{height: '80%', marginLeft: -30}}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={editPen} style={{width: 50, height: 50}} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 15}}>Public Username</Text>

              <TouchableOpacity
                onPress={() => {
                  setEditable(!editable);
                }}>
                <Image source={editPen} style={{width: 30, height: 30}} />
              </TouchableOpacity>
            </View>

            {editable ? (
              <TextInput
                maxLength={22}
                placeholder={publicUsername}
                value={publicUsername}
                style={[
                  styles.publicUsername,
                  {
                    color: 'black',
                    borderBottomWidth: 0.7,
                  },
                ]}
                onChangeText={text => setPublicUsername(text)}
                ref={ref => {
                  input = ref;
                }}
                selectTextOnFocus={true}
              />
            ) : (
              <Text style={(styles.publicUsername, {color: '#383838'})}>
                {publicUsername}
              </Text>
            )}

            {editable ? (
              <TextInput
                placeholder={'Enter Designation'}
                value={designation !== '' && designation}
                maxLength={25}
                style={[
                  styles.publicUsername,
                  {
                    color: 'black',
                    borderBottomWidth: 0.7,
                  },
                ]}
                onChangeText={text => setDesignation(text)}
                ref={ref => {
                  input = ref;
                }}
                selectTextOnFocus={true}
                placeholderTextColor="gray"
              />
            ) : (
              <Text style={(styles.publicUsername, {color: '#383838'})}>
                {designation == '' ? 'No Designation' : designation}
              </Text>
            )}
            <View style={{marginTop: 5}}>
              <Text style={{color: 'gray'}}>{`bumpme.in/${username}`}</Text>
            </View>
          </View>
          {/* <View >
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={styles.uploadText}>
                {profileImage || imageUrl ? "Edit Image " : `Upload ${'\n'}profile picture`}

              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.btnContainerHeading}>Add Social Media</Text>
          <View style={styles.socialBtnContainer}>
            {socialMediaComps.map((item, index) => {
              let alreadyPresent = false;

              socialMedia.map(x => {
                if (x.title == item.title) alreadyPresent = true;
              });
              return (
                <ContactBtn
                  item={item}
                  key={index.toString()}
                  docId={docId}
                  email={email}
                  cat={'social'}
                  alreadyPresent={alreadyPresent}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.btnContainerHeading}>Add Contact Details</Text>
          <View style={styles.socialBtnContainer}>
            {contactDetails.map((item, index) => {
              let alreadyPresent = false;

              socialMedia.map(x => {
                if (x.title == item.title) alreadyPresent = true;
              });
              return (
                <ContactBtn
                  item={item}
                  key={index.toString()}
                  email={email}
                  docId={docId}
                  cat={'contact'}
                  alreadyPresent={alreadyPresent}
                />
              );
            })}
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => saveProfile()}>
          <Text style={styles.btnText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Pressable style={styles.modal}>
          <View style={styles.submodal}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.crossBtn}>
              <Image source={XIco} style={{height: 15, width: 15}} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 7}}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => requestCameraPermission('gallery')}>
                <Image
                  source={gallery}
                  style={{height: 45, width: 45}}
                  tintColor={'#4784E1'}
                />
                <Text style={{fontSize: 12}}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => requestCameraPermission('camera')}>
                <Image
                  source={camera}
                  style={{height: 45, width: 45}}
                  tintColor={'#4784E1'}
                />
                <Text style={{fontSize: 12}}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => deleteProfPic()}>
                <Image
                  source={DeleteIco}
                  style={{height: 45, width: 45, tintColor: 'red'}}
                />
                <Text style={{fontSize: 12}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SetupProfile;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  profileImageContainer: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profImgWrapper: {
    height: 90,
    width: 90,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#9E9E9E40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    height: 30,
    width: 30,
  },
  uploadText: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    padding: 6,
    //fontFamily: 'Poppins-Regular',
  },
  publicUrl: {
    paddingTop: 20,
    textAlign: 'center',
    opacity: 0.3,
    fontSize: 13,
    lineHeight: 22,
  },
  publicUsername: {
    padding: 0,
    margin: 0,
    width: '80%',
    fontSize: 13,
    borderColor: 'gray',
  },
  detailsContainer: {
    paddingTop: 20,
    width: '60%',
  },

  socialContainer: {
    paddingTop: 30,
  },
  btnContainerHeading: {
    paddingLeft: 20,
    fontSize: 17,
  },
  socialBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btn: {
    width: 335,
    height: 60,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4784E1',
    borderRadius: 50,
    elevation: 10,
    // shadowColor: 'rgba(176, 115, 255, 0.5)',
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },
  modal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  submodal: {
    width: '80%',
    backgroundColor: 'white',
    height: 120,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
  crossBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
    width: 30,
    alignItems: 'center',
  },
  modalBtn: {
    width: 70,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});
