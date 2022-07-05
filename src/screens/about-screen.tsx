import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Icon,
  Image,
  useColorModeValue,
  View
} from 'native-base'
import { Feather } from '@expo/vector-icons'
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'
import LinkButton from '../components/link-button'
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const AboutScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('hittt')
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'warmGray.900')}
      w="full"
    >
      <Masthead
        title="Manage your budget"
        image={require('../assets/about-masthead.png')}
      >
        <Navbar />
      </Masthead>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl ggg</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl hhh</Text>


        </ScrollView>
    </AnimatedColorBox>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AboutScreen
