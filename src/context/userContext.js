import React, { useContext, useState } from 'react'
import { createContext } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export const userContext = createContext({
    userDetails: null,
    setUserDetails: () => { },
    globalLoading: null,
    setUser: () => { },
    getUserDetails: () => { },
})



export function UserContextProvider({ children }) {


    const [userDetails, setUserDetails] = useState({})
    const [globalLoading, setGlobalLoading] = useState(false)


    const getUserDetails = async () => {
        setGlobalLoading(true)
        let { email } = auth().currentUser;
        await firestore().collection('Users')
            .where('email', '==', email)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs.map(doc => {
                    // console.log('LOG 1', doc.data());
                    setUserDetails(doc.data());
                    setGlobalLoading(false)
                });
            });
    }
    return (
        <userContext.Provider value={{ userDetails, getUserDetails, globalLoading, setUserDetails }} >
            {children}
        </userContext.Provider>
    )
}

export const useUserContext = () => {
    const { userDetails, getUserDetails, setUserDetails } = useContext(userContext);

    return { userDetails, getUserDetails, setUserDetails }
}