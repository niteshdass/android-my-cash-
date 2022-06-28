import React, { useEffect } from 'react'
import { Text } from 'native-base'
import { AsyncStorage } from 'react-native';

export default function Logout({auth,  setAuth}) {
    useEffect( async () => {
        try {
            console.log('hhhhhh')
            await AsyncStorage.removeItem('auth');
            setAuth(false);
          } catch (error) {
            // Error retrieving data
          }
    }, [])
  return (
    <Text>logout</Text>
  )
}

