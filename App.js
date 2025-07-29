import 'react-native-gesture-handler';
// import RNBootSplash from "react-native-bootsplash";

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AuthNav from './src/navigation/AuthNav';
import AppNav from './src/navigation/AppNav';
import linking from './src/linking';

import GlobalFont from 'react-native-global-font';
import {UserContextProvider} from './src/context/userContext';
import SplashScreen from './src/screens/SplashScreen';

const App = () => {
  useEffect(async () => {
    // const init = async () => {
    //   // …do multiple sync or async tasks
    // };

    let fontName = 'Poppins-Regular';
    GlobalFont.applyGlobal(fontName);

    // await RNBootSplash.hide({ fade: true });
    // console.log("Bootsplash has been hidden successfully");
  }, []);

  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);
  const [opening, setOpening] = useState(true);

  const onAuthStateChanged = user => {
    setUser(user);
    setInitialising(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (opening) {
    return <SplashScreen onAnimationFinish={() => setOpening(false)} />;
  }

  if (initialising) return null;
  return (
    <NavigationContainer linking={linking}>
      <UserContextProvider>
        {user ? <AppNav /> : <AuthNav />}
      </UserContextProvider>
    </NavigationContainer>
  );
};

export default App;
