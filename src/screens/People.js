import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import HeaderComponent from '../components/HeaderComponent';

const People = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  let {email} = auth().currentUser;

  useEffect(async () => {
    let list = [];

    console.log(email);
    await firestore()
      .collection('Users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list = doc._data?.Friends ? doc._data.Friends : [];
        });
        setFriendsList(list);
        console.log(friendsList);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent title1={'Friends'} />
      {friendsList.length == 0 && (
        <View>
          <Text>No friends available</Text>
        </View>
      )}
      <View>
        {friendsList.map(friend => (
          <View style={styles.item}>
            <Text>{friend}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default People;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
  },
});
