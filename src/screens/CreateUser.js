import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CreateUser = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const prohibitedUsernames = [
    'about',
    'admin',
    'products',
    'privacy',
    'termsandconditionsm',
    'custom',
    'terms',
  ];

  const CreateUsername = async () => {
    // add username to userdata
    setLoading(true);
    await firestore()
      .collection('Users')
      .doc(docId)
      .update({
        username: username.toLowerCase(),
        socialMedia: [],
      })
      .then(() => {
        console.log('User added!');
        navigation.navigate('SetupProfile');
      });
  };

  const dataEntryCodeChecker = async () => {
    let isExist;
    await firestore()
      .collection('dataEntry')
      // Filter results
      .where('code', '==', username.toLowerCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          isExist = true;
        } else {
          isExist = false;
        }
      });
    if (isExist) return true;
    return false;
  };

  // to check whether username available or not
  const usernameChecker = async () => {
    if (
      username.includes(' ') ||
      username.includes('.') ||
      username.includes(',') ||
      username.includes(';') ||
      username.includes(':')
    ) {
      return setUserNameError(true);
    }
    setUserNameError(false);
    await firestore()
      .collection('Users')
      // Filter results
      .where('username', '==', username.toLowerCase())
      .get()
      .then(async querySnapshot => {
        if (querySnapshot.size > 0) {
          setIsAvailable(false);
        } else if (prohibitedUsernames.includes(username)) {
          setIsAvailable(false);
        } else if (await dataEntryCodeChecker()) {
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
        }
      });
  };

  // to retrieve user email.
  useEffect(() => {
    const {email} = auth().currentUser;
    setEmail(email);
    firestore()
      .collection('Users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setDocId(doc.id);
        });
      });
  }, []);

  // to check whether the entered username exits.
  useEffect(() => {
    if (username) {
      usernameChecker();
    }
  }, [username]);

  const onClickHandler = () => {
    usernameChecker().then(() => {
      if (userNameError) {
        return;
      }
      if (isAvailable) {
        Alert.alert(
          'Warning',
          'Your username and URL cannot be changed later. Are you sure you want to proceed',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Proceed', onPress: () => CreateUsername()},
          ],
        );
      } else {
        console.log('username not available');
      }
    });
  };

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AuthHeader title1="Create Username" backBtn={'logout'} noBackBtn />
        <View style={styles.textContainer}>
          <Text style={{fontSize: 18, marginTop: 0}}>
            Please choose a unique
          </Text>
          <Text style={{fontSize: 18}}>username for yourself.</Text>
        </View>

        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              username && {borderBottomColor: '#383838'},
            ]}>
            <TextInput
              placeholder="Username"
              onChangeText={text => setUsername(text)}
              value={username}
              placeholderTextColor="gray"
              style={{color: 'black'}}
            />
          </View>

          <View style={styles.urlContainer}>
            {/* {username ? <Text style={{ fontSize: 20 }} >Custom Url</Text> : null} */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: 'black'}}>{'bumpme.in/ '}</Text>
                <Text
                  style={{
                    color: 'black',
                    paddingHorizontal: 5,
                    backgroundColor: '#C4C4C4',
                    borderRadius: 5,
                  }}>
                  {username}
                </Text>
              </View>
              <View
                style={[
                  styles.WarningDot,
                  {backgroundColor: isAvailable ? '#C5FDAA' : '#FF5252'},
                ]}>
                <Text style={{fontSize: 10, color: 'white'}}>
                  {isAvailable || !userNameError ? '✔' : '!'}
                </Text>
              </View>
            </View>
          </View>
          {userNameError && (
            <Text style={styles.errorMsg}>
              Only alphabets, numbers, and underscore is allowed.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            isAvailable && {
              backgroundColor: '#4784E1',
              elevation: 10,
              shadowColor: '#4784E1',
            },
          ]}
          onPress={() => onClickHandler()}
          disabled={!isAvailable}>
          <Text style={{color: 'white', fontWeight: '500', fontSize: 17}}>
            Create Username
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateUser;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  textContainer: {
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginTop: 38,
    paddingHorizontal: 15,
    height: '33%',
  },
  inputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    marginTop: -15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 8,
    alignSelf: 'center',
    backgroundColor: 'gray',
  },
  urlContainer: {
    paddingTop: 40,
  },
  btn: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4C7C4',
    marginVertical: -30,
    marginHorizontal: 20,
    borderRadius: 50,
  },
  WarningDot: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#FF5252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMsg: {
    color: 'red',
    marginTop: 10,
    fontSize: 15,
  },
});
