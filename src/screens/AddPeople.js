import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddPeople = ({route}) => {
  const {username} = route.params;

  const [loading, setLoading] = useState(true);
  const [docId, setDocId] = useState('');

  useEffect(async () => {
    let {email} = auth().currentUser;
    console.log(email);
    firestore()
      .collection('Users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setDocId(doc.id);
        });
      })
      .then(async () => {
        await firestore()
          .collection('Users')
          .doc(docId)
          .update({
            Friends: firestore.FieldValue.arrayUnion(username),
          })
          .then(() => {
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
          });
      });
  }, []);

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
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text>bumpme.in/{username}</Text>
    </View>
  );
};

export default AddPeople;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  username: {
    fontSize: 25,
    fontWeight: '600',
  },
});
