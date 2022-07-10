import React, { useCallback, useState, useEffect } from 'react'
import { Icon, VStack, useColorModeValue, Fab, Text, ScrollView, Heading } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions, AsyncStorage, RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import AnimatedColorBox from '../components/animated-color-box'
import axios from 'axios';
import Masthead from '../components/masthead'
import NavBar from '../components/navbar'
import AddCashModal from '../components/modal/AddCashModal'
import AddBudgetModal from '../components/modal/AddBudgetModal'
import AddLoanModal from '../components/modal/AddLoanModal';
import Signup from '../components/auth/Signup';
import PiChart from '../components/piChart';
import MonthlySummary from '../components/home/MonthlySummary';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Loan from './about-screen';
import ListItem from '../components/List';
import {
  BarChart,
  LineChart,

} from "react-native-chart-kit";
import colorArray from '../helper/color';
import { ActivityIndicator, BottomNavigation } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sepetember", "October", "November", "December"]
export default function MainScreen({ auth, setAuth }) {
  const [loading, setLoading] = useState<Boolean>(false);
  const [totalMonthlyDebit, setDebit] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState({});
  const [date, setDate] = useState();
  const [totalMonthlyCredit, setCredit] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [loadError, setError] = useState<Boolean>(false);
  const [category, setCategory] = useState({})
  const [refreshing, setRefreshing] = React.useState(false);
  const [total, setTotal] = useState({});
  const [monthlyTotal, setMonthlyTotal] = useState({})
  const [totalDebit, setTotalDebit] = useState([]);
  const [totalCredit, setTotalCredit] = useState([]);
  const [totalDebitCredit, setTotalDebitCredit] = useState({})
  const [user, setUser] = useState({});
  const [totalBudgetData, setTotalBudgetData] = useState([]);
  const [getAllMonthDabitTotal, setAllMonthDebitTotal] = useState({});
  const [allLoanData, setTotalLoanData] = useState({});
  const [loanData, setLoanData] = useState([]);
  const prepareBudgetsdata = (data) => {
    setTotalBudgetData(data);
    var flags = [], output = [], credit = [], l = data.length, i;
    let dTotal = 0, cTotal = 0;
    for (i = 0; i < l; i++) {
      if (data[i].budget_type === 'debit') {
        dTotal = dTotal + data[i]?.amount;
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
      } else {
        cTotal = cTotal + data[i]?.amount;
        if (flags[data[i].purpose]) continue;
        flags[data[i].purpose] = true;
        const result = data.filter(budget => budget.purpose === data[i].purpose);
        const sum = result.reduce((accumulator, object) => {
          return accumulator + object.amount;
        }, 0);
        credit.push({
          name: data[i].purpose, amount: sum, legendFontColor: colorArray[i],
          legendFontSize: 12, color: colorArray[i]
        });
      }
    }
    setTotalDebit(output);
    setTotal({ cTotal, dTotal })

    setTotalCredit(credit);
    setTotalDebitCredit({ labels: ['Earn', 'Cost', 'Save'], datasets: [{ data: [cTotal, dTotal, cTotal - dTotal] }] })
  }

  const loadTotalBudgetDtat = async () => {
    setLoading(true);
    const d = new Date();
    let user_data = await AsyncStorage.getItem('auth');
    user_data = JSON.parse(user_data);
    await axios.get(`https://my-cash-app.herokuapp.com/budget/${user_data?.user?._id}`)
      .then(async function (response) {
        prepareBudgetsdata(response.data.reverse());
        getEachMonthCostTotal(response.data);
      }).catch(function (error) {
        setError(true);
        setLoading(false);
      })
      .then(function () {
        setLoading(false);
      });
  }

  const todo = () => 'todo';
  const getAuthUser = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem('auth');
      if (value !== null) {
        // We have data!!
        let data = JSON.parse(value);
        setUser(data?.user);
        setAuth(true);
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('auth');
      setAuth(false);

    } catch (error) {
      // Error retrieving data
    }
  }
  const prepareCategoryData = (data) => {
    let loandata = [];
    let transaction = [];

    data?.map(item => {
        if(item?.slug === "cash") {
            transaction.push(item);
        } else if(item?.slug === "loan") {
            loandata.push(item);
        }
    })
    setCategory({loandata, transaction});

}
  const getCateGory = async () => {
    const user_data = await AsyncStorage.getItem('auth');
    let users = JSON.parse(user_data);
    let _id = users?.user?._id;
    await axios.get(`https://my-cash-app.herokuapp.com/category/${_id}`)
      .then(async function (response) {
        response?.data && (
          prepareCategoryData(response?.data)
        )
      }).catch(function (error) {
        // handle error
        setError(true);
      })
      .then(function () {
        // always executed
      });
  };

  const preparedata = (data) => {
    var flags = [], output = [], credit = [], l = data.length, i;
    let dTotal = 0, cTotal = 0;

    for (i = 0; i < l; i++) {
      if (data[i].budget_type === 'debit') {
        dTotal = dTotal + data[i].amount;
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
      } else {
        cTotal = cTotal + data[i].amount;
        if (flags[data[i].purpose]) continue;
        flags[data[i].purpose] = true;
        const result = data.filter(budget => budget.purpose === data[i].purpose);
        const sum = result.reduce((accumulator, object) => {
          return accumulator + object.amount;
        }, 0);
        credit.push({
          name: data[i].purpose, amount: sum, legendFontColor: colorArray[i],
          legendFontSize: 12, color: colorArray[i]
        });
      }
    }
    setDebit(output);
    setCredit(credit);
    setMonthlyTotal({ cTotal, dTotal });
    setTotalData({ labels: ['Earn', 'Cost', 'Save'], datasets: [{ data: [cTotal, dTotal, cTotal - dTotal] }] })

  }

  const getEachMonthCostTotal = (data) => {
    var flags = [], output = [], credit = [], l = data.length, i;
    var localMonths = [];
    var localTotals = [];

    for (i = 0; i < l; i++) {
      if (data[i].budget_type === 'debit') {
        if (flags[data[i].month]) continue;
        flags[data[i].month] = true;
        const result = data.filter(budget => budget.month === data[i].month && budget?.budget_type === 'debit');
        const sum = result.reduce((accumulator, object) => {
          return accumulator + object.amount;
        }, 0);
        // output.push({
        //   month: months[data[i].month - 1],
        //   total: sum
        // });
        localMonths.push(months[data[i].month - 1]);
        localTotals.push(sum);

      }
    }
    setAllMonthDebitTotal({
      labels: localMonths,
      datasets: [
        {
          data: localTotals
        }
      ]
    })
  }

  const loadBudgets = async () => {
    const d = new Date();
    setDate(d);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    const user_data = await AsyncStorage.getItem('auth');
    // We have data!! month/${data?.user?._id}/${month}/${year}
    let data = JSON.parse(user_data);
    await axios.get(`https://my-cash-app.herokuapp.com/budget/month/${data?.user?._id}/${month}/${year}`)
      .then(async function (response) {
        preparedata(response.data.reverse());
      }).catch(function (error) {
        // handle error
      })
      .then(function () {
        // always executed
      });
  }

  const prepareLoanData = (data) => {
    var flags = [], output = [], credit = [], l = data.length, i;
    var localMonths = [];
    var localTotals = [];
    var localLoanDtat = [];

    for (i = 0; i < l; i++) {
      data[i].id = data[i]?._id;
      localLoanDtat.push(data[i]);
        if (flags[data[i].loan_type]) continue;
          flags[data[i].loan_type] = true;
          const result = data.filter(budget => budget.loan_type === data[i].loan_type);
          const sum = result.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);  
        localMonths.push(data[i].loan_type);
        localTotals.push(sum);
      }
      setLoanData(localLoanDtat);
    setTotalLoanData({
      labels: localMonths,
      datasets: [
        {
          data: localTotals
        }
      ]
    })
  }

  const getLoan = async () => {
    const user_data = await AsyncStorage.getItem('auth');
    let data = JSON.parse(user_data);
    await axios.get(`https://my-cash-app.herokuapp.com/loan`)
      .then(async function (response) {
        prepareLoanData(response.data.reverse());
      }).catch(function (error) {
        // handle error
      })
      .then(function () {
        // always executed
      });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAuthUser()
    loadTotalBudgetDtat();
    getCateGory();
    getLoan();
    getMonthTarget();
    loadBudgets().then(() => setRefreshing(false));

  }, []);

  const getMonthTarget = async () => {
    const d = new Date();
    // let year = d.getFullYear();
    let month = d.getMonth() + 1;
    // const user_data = await AsyncStorage.getItem('auth'); 
    // We have data!!
    // let data = JSON.parse(user_data);
    await axios.get(`https://my-cash-app.herokuapp.com/target/`)
      .then(async function (response) {
        let totalTarget = 0;
        let current_total = 0;
        response?.data?.map((item) => {
          totalTarget = totalTarget + item?.target_ammount;
          if (item?.month == month) {
            current_total = item?.target_ammount;
          }
        })
        setMonthlyTarget({ totalTarget, current_total })
      }).catch(function (error) {
        // handle error
      })
      .then(function () {
        // always executed
      });
  }


  useEffect(() => {
    const controller = new AbortController();
    getAuthUser()
    loadTotalBudgetDtat();
    getCateGory();
    getLoan();
    loadBudgets();
    getMonthTarget();
    return () => {
      controller.abort();
    }
  }, [])
  const monthySummary = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <MonthlySummary
          yearlyData={total}
          total={monthlyTotal}
          totalMonthlyDebit={totalMonthlyDebit}
          totalMonthlyCredit={totalMonthlyCredit}
          totalData={totalData}
          monthlyTarget={monthlyTarget}
        />
      </ScrollView>
    )
  }
  const yearlySummary = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Loan getAllMonthDabitTotal={getAllMonthDabitTotal} title="Each month expenses"  />

        <View style={{ backgroundColor: '#e9f3f5', height: 300, margin: 10 }}>

          <Heading style={{ paddingLeft: 20, fontSize: 18, paddingTop: 20 }}>
            <IconM
              name={'decagram'}
              style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
            /> Expenses summary {total?.dTotal} <IconM
              name={'currency-bdt'}
              style={{ color: '#7978B5', fontSize: 22, marginRight: 10 }}
            />
          </Heading>
          <PiChart totalDebit={totalDebit} />
        </View>
        <View style={{ backgroundColor: '#e9f3f5', height: 300, margin: 10 }}>

          <Heading style={{ paddingLeft: 20, fontSize: 18 }}>
            <IconM
              name={'decagram'}
              style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
            /> Monthly Income Expenses Savings
          </Heading>
          {
            totalDebitCredit?.labels?.length && (
              <BarChart
                data={totalDebitCredit}
                width={370} // from react-native
                height={200}
                yAxisLabel="k"
                horizontalLabelRotation={-10}
                yAxisSuffix="tk"
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
                  marginTop: 30,
                  borderRadius: 6,
                  paddingLeft: 3
                }}
              />
            )
          }
        </View>
      </ScrollView>
    )
  }
  const LoanPage = () => {
    return       <ScrollView
    contentContainerStyle={styles.scrollView}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
  >
    <Loan getAllMonthDabitTotal={allLoanData} title="Loan summary" />
    <ListItem loanData={loanData} getLoan={getLoan} />
    </ScrollView>
  }
  // TABS
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'This Month' },
    { key: 'second', title: 'Total' },
    { key: 'third', title: 'Loan' }
  ]);

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
          {
            loading ? <ActivityIndicator style={{ marginTop: 200 }} size="large" color="#2b7fed" />
              : <>
                <VStack
                  flex={1}
                  space={1}
                  bg={useColorModeValue('warmGray.50', 'primary.900')}
                  mt="-80px"
                  borderTopLeftRadius="20px"
                  borderTopRightRadius="20px"
                  pt="0px"
                >

                  {
                    (loadError || !totalBudgetData?.length) ? <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>There are no data found for you.</Text> :
                      <>
                        <TabView
                          navigationState={{ index, routes }}
                          onIndexChange={setIndex}
                          renderScene={SceneMap({
                            first: monthySummary,
                            second: yearlySummary,
                            third: LoanPage
                          })}
                        />
                      </>
                  }
                </VStack>
                <View style={{ backgroundColor: '#0b68e0', width: 400, height: 55 }}>
                  <AddCashModal fetchData={todo} category={category?.transaction} />
                  <AddLoanModal fetchData={todo} category={category?.loandata} />

                  <View style={{ marginTop: -20 }}>
                    <Text style={{ color: '#ffff', fontWeight: 'bold', marginLeft: 290 }}>
                      LOG OUT
                    </Text>
                    <Fab
                      renderInPortal={false}
                      style={{ width: 35, height: 35, marginRight: 50 }}
                      icon={<Icon color="white" as={<AntDesign name="logout" />} size="sm" />}
                      colorScheme={useColorModeValue('red', 'darkBlue')}
                      bg={useColorModeValue('red.500', 'red.400')}
                      onPress={() => logOut(true)}
                    />
                  </View>
                </View>
              </>
          }

        </> : <Signup callBack={setAuth} />
      }

    </AnimatedColorBox>
  )
}

const styles = StyleSheet.create({

});
