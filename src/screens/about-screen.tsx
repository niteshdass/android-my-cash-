import React, { useState, useEffect } from 'react'
import {
  useColorModeValue
} from 'native-base'
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'
import { View, useWindowDimensions, StyleSheet, Text, Dimensions } from 'react-native';
import { Heading } from 'native-base';
import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';


const AboutScreen = ({ getAllMonthDabitTotal, title }) => {
  const [auth, setAuth] = useState(false);


  return (
    <View style={{ backgroundColor: '#e9f3f5', height: 300, margin: 10 }}>
      <Heading style={{ paddingLeft: 20, fontSize: 18, paddingTop: 20 }}>
        <IconM
          name={'decagram'}
          style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
        /> {title}
      </Heading>
      <BarChart
        data={getAllMonthDabitTotal}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        fromZero={true}
        showValuesOnTopOfBars={true}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundGradientFrom: "#e9f3f5",
          backgroundGradientTo: "#e9f3f5",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            paddingLeft: 10
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#fcfcfc"
          }
        }}
        bezier
        style={{
          marginVertical: 11,
          borderRadius: 16
        }}
      />
    </View>
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
