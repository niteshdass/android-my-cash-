import React, { useCallback, useState, useEffect } from 'react'
import { Icon, VStack, useColorModeValue, Fab, View, Text, ScrollView, Heading } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions, AsyncStorage } from 'react-native';
import AnimatedColorBox from '../components/animated-color-box'
import TaskList from '../components/task-list'
import shortid from 'shortid'
import axios from 'axios';
import Masthead from '../components/masthead'
import NavBar from '../components/navbar'
import AddCashModal from '../components/modal/AddCashModal'
import AddBudgetModal from '../components/modal/AddBudgetModal'
import Signup from '../components/auth/Signup';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

export default function MainScreen({ auth, setAuth }) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState<Boolean>(false)
  const [budgets, setBudgets] = useState([])
  const [totalDebit, setTotalDebit] = useState([])
  const prepareBudgetsdata = (data) => {
    var flags = [], output = [], l = data.length, i;
    for (i = 0; i < l; i++) {
      if (data[i].budget_type === 'debit') {
        if (flags[data[i].purpose]) continue;
        flags[data[i].purpose] = true;
        const result = data.filter(budget => budget.purpose === data[i].purpose);
        const sum = result.reduce((accumulator, object) => {
          return accumulator + object.amount;
        }, 0);
        output.push({
          name: data[i].purpose, amount: sum, legendFontColor: colorArray[i],
          legendFontSize: 12, color: colorArray[i]
        });
      }
    }
    setTotalDebit(output);
  }

  const loadBudgets = async () => {
    setLoading(true);
    const d = new Date();
    let month = d.getMonth()
    await axios.get('https://nitesh-cash-api.herokuapp.com/budget/')
      .then(async function (response) {
        prepareBudgetsdata(response.data.reverse());
      }).catch(function (error) {
        // handle error
        setLoading(false);
      })
      .then(function () {
        // always executed
        setLoading(false);
      });
  }

  const todo = () => 'todo';
  const getAuthUser = async () => {
        try {
        const value = await AsyncStorage.getItem('auth');
        if (value !== null) {
          // We have data!!
          console.log(value)
          setAuth(true);
        }
      } catch (error) {
        // Error retrieving data
      }
  }
  const logOut = async () => {
    try {
      const value = await AsyncStorage.removeItem('auth');
      console.log(value);
      setAuth(false);

    } catch (error) {
      // Error retrieving data
    }
  }
  useEffect(() => {
    getAuthUser()
    loadBudgets();
  }, [])
  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      {
        auth ? <>
           <Masthead
        title="What's up, Bindaas!"
        image={require('../assets/masthead.png')}
      >
        <NavBar />
      </Masthead>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px"
      >
        <ScrollView>
        <Heading>Total debit summary</Heading>
        <PieChart
          data={totalDebit}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }} accessor={"amount"}
          backgroundColor={"transparent"}
          absolute
        />
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  100, 200, 100, 400, 300, 500
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#fcfc",
            backgroundGradientFrom: "#fcfc",
            backgroundGradientTo: "red",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            margin: 20
          }}
        />
        </ScrollView>
      </VStack>
      <AddCashModal fetchData={todo} />
        </> :    <Signup callBack= {setAuth} />
      }
  
      <AddBudgetModal />

      <Fab
                renderInPortal={false}
                style={{ width: 50, height: 50, marginRight: 10 }}
                icon={<Icon color="white" as={<AntDesign name="logout" />} size="sm" />}
                colorScheme={useColorModeValue('blue', 'darkBlue')}
                bg={useColorModeValue('blue.500', 'blue.400')}
                onPress={() => logOut(true)}
            />

    </AnimatedColorBox>
  )
}
