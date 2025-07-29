import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Home from '../screens/Home';
import EmailVerification from '../screens/EmailVerification';
import CreateUser from '../screens/CreateUser';
import SetupProfile from '../screens/SetupProfile';
import AddBtn from '../screens/AddBtn';
import SetupBump from '../screens/SetupBump';
import Profile from '../screens/Profile';
import QRScanner from '../screens/QRScanner';
import People from '../screens/People';

import homeIcon from '../assets/images/home.png';
import contact from '../assets/images/contacts.png';
import scannerIcon from '../assets/images/scanner.png';
import AddPeople from '../screens/AddPeople';
import SplashScreen from '../screens/SplashScreen';
import {useUserContext} from '../context/userContext';
import About from '../screens/About';
import ShowPic from '../screens/ShowPic';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNav = () => {
  const [initialRoute, setInitialRoute] = useState('');
  const [initialising, setInitialising] = useState(true);

  const {getUserDetails} = useUserContext();

  // To handle which screen to be shown if username not exist it will show from username create screen and so on.
  useEffect(() => {
    initialRouteHandler();
    getUserDetails();
  }, []);

  const initialRouteHandler = async () => {
    let user = auth().currentUser;

    console.log(auth().currentUser);

    // if (!user.emailVerified) {
    //   setInitialRoute('EmailVerification');
    //   setInitialising(false);
    //   // console.log(user.emailVerified,'veri')
    //   return
    // }
    try {
      await firestore()
        .collection('Users')
        // Filter results
        .where('email', '==', user.email)
        .get()
        .then(async querySnapshot => {
          if (querySnapshot.empty) {
            await firestore()
              .collection('Users')
              .add({
                email: user.email,
                verified: true,
              })
              .then(() => {
                console.log('code correct');
                setInitialRoute('CreateUser');
                setInitialising(false);

                //   setLoading(false)
              });
          } else {
            querySnapshot.forEach(data => {
              setInitialRoute('CreateUser');

              if (data.data().username) {
                setInitialRoute('SetupProfile');
                console.log('ok1');
              }
              if (data.data().publicUsername) {
                setInitialRoute('BottomNav');
                console.log('ok2');
              }

              setInitialising(false);
            });
          }

          // setOpening(false)
        });
    } catch (error) {}
  };
  if (initialising) {
    // return null

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
      // <SplashScreen />
    );
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#DDE8F9"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        barStyle={'dark-content'}
        hidden={false}
      />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRoute}>
        {/* <Stack.Screen name="EmailVerification" component={EmailVerification} /> */}
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="SetupProfile" component={SetupProfile} />
        <Stack.Screen name="AddBtn" component={AddBtn} />
        <Stack.Screen name="SetupBump" component={SetupBump} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="Peoples" component={People} />
        <Stack.Screen name="AddPeople" component={AddPeople} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="ShowPic" component={ShowPic} />
      </Stack.Navigator>
    </>
  );
};

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconColor = focused ? '#4784E1' : '#383838';

          if (route.name === 'Home') {
            iconName = homeIcon;
          } else if (route.name === 'Profile') {
            iconName = contact;
          } else if (route.name === 'QRScanner') {
            iconName = scannerIcon;
          }

          return (
            <Image
              source={iconName}
              size={size}
              color={color}
              style={{width: 20, height: 20, tintColor: iconColor}}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4784E1',
        inactiveTintColor: '#383838',
      }}>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="QRScanner" component={QRScanner} />
    </Tab.Navigator>
  );
};

export default AppNav;
