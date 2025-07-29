import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from '../assets/images/back.png';
import {useUserContext} from '../context/userContext';

const Settings = ({navigation}) => {
  // const [activeSections, setActiveSections] = useState([])

  const [loading, setLoading] = useState(false);
  const {setUserDetails} = useUserContext();

  const logout = () => {
    setLoading(true);
    setUserDetails({});
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
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
    <SafeAreaView style={styles.container}>
      <View
        style={{flex: 1, paddingHorizontal: Platform.OS === 'ios' ? 30 : 22}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <View style={{marginTop: 30}}>
          {/* <Accordion
                    activeSections={activeSections}
                    sections={CONTENT}
                    touchableComponent={TouchableOpacity}
                    renderHeader={(section, index, isActive) => <SectionHeader section={section} isActive={isActive} />}
                    renderContent={(section) => <SectionContent section={section} />}
                    onChange={(items) => { setActiveSections(items) }}
                /> */}
          <TouchableOpacity
            style={styles.SectionHeader}
            onPress={() =>
              navigation.navigate('SetupProfile', {fromSettings: true})
            }>
            <Text style={styles.sectionTitle}>Setup Profile</Text>
            <Image source={Icon} style={styles.sectionHeaderIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.SectionHeader}
            onPress={() => navigation.navigate('SetupBump')}>
            <Text style={styles.sectionTitle}>Setup Bump</Text>
            <Image source={Icon} style={styles.sectionHeaderIcon} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.SectionHeader}>
            <Text style={styles.sectionTitle}>Buy a Bump</Text>
            <Image source={Icon} style={styles.sectionHeaderIcon} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.SectionHeader}
            onPress={() => navigation.navigate('About')}>
            <Text style={styles.sectionTitle}>About</Text>
            <Image source={Icon} style={styles.sectionHeaderIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.SectionHeader}
            onPress={() => Linking.openURL('https://bumpme.in/help')}>
            <Text style={styles.sectionTitle}>Help</Text>
            <Image source={Icon} style={styles.sectionHeaderIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={() => logout()}>
          <Text style={{fontSize: 17, color: 'black'}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 30 : 22,

    flex: 1,
    backgroundColor: 'white',
  },

  headerText: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  SectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  sectionHeaderIcon: {
    width: 20,
    height: 20,
    transform: [{rotate: '180deg'}],
  },
  sectionTitle: {
    fontSize: 17,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    marginTop: 65,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});
