import React, { useState } from 'react'
import axios from 'axios';
import {
    ScrollView,
    VStack,
    useColorModeValue,
    Center,
    Skeleton, Text, Heading, View, Fab, Icon
} from 'native-base';
import { DataTable, IconButton } from 'react-native-paper';
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'
import AddCashModal from '../components/modal/AddCashModal.js';
import AddBudgetModal from '../components/modal/AddBudgetModal';
import ReadBudgetModal from '../components/modal/ListBudgetModal'
import { AsyncStorage, Alert, RefreshControl } from 'react-native';

const AboutScreen = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [tableData, setTableData] = useState([]);
    const [category, setCategory] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    // budget fetch
    const fetchData = async () => {
        const user_data = await AsyncStorage.getItem('auth');
        const d = new Date();
        // setDate(d);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        // We have data!! month/${data?.user?._id}/${month}/${year}
        let users = JSON.parse(user_data);
        setLoading(true);
        const resp = await fetch(`https://my-cash-app.herokuapp.com/budget/month/${users?.user?._id}/${month}/${year}`);
        const data = await resp.json();
        if (data?.length) {
            setTableData(data.reverse());
        } else {
            setTableData([])
        }
        setLoading(false);
    };


    const getCateGory = async () => {
        const user_data = await AsyncStorage.getItem('auth');
        let users = JSON.parse(user_data);
        let _id = users?.user?._id;
        await axios.get(`https://my-cash-app.herokuapp.com/category/${_id}`)
            .then(async function (response) {
                response?.data && (
                    setCategory(response?.data)
                )
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                console.log('jjj')
            });
    };


    // delete budget
    const deleteBudget = async (data) => {
        await axios.delete(`https://my-cash-app.herokuapp.com/budget/${data._id}`);
        fetchData();
    }
    // confirmation for delate
    const _alertIndex = (index) => {
        Alert.alert(
            "Are you sure ?",
            "Delete the budget.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => deleteBudget(index) }
            ]
          );
    }
    // credit and debit row color
    let styleData = (data) => {
        if (data === 'credit') {
            return { backgroundColor: '#fcfcfc' }
        }
        return { backgroundColor: '#eae8eb', color: 'white' }
    }

    const onRefresh = React.useCallback(() => {
        fetchData();
        getCateGory();
      }, []);

    React.useEffect(() => {
        fetchData();
        getCateGory();
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
                bg={useColorModeValue('warmGray.50', 'primary.900')}
                mt="-50px"
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
            >
                <VStack
                    space={4}
                    bg={useColorModeValue('warmGray.50', 'primary.900')}
                    mt="-100px"
                    pt="30px"
                    p={20}
                    m={7}
                >
                </VStack>
                <ScrollView
                    borderTopLeftRadius="20px"
                    borderTopRightRadius="20px"
                    bg={useColorModeValue('warmGray.50', 'primary.900')}
                    mt="-43px"
                    p={4}
                    horizontal={true}

                >
                    <DataTable style={{ margin: 0, paddingTop: -40 }}>
                        {loading ?
                            <Center w="370">
                                <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
                                    borderColor: "coolGray.500"
                                }} _light={{
                                    borderColor: "coolGray.200"
                                }}>
                                    <Skeleton h="40" />
                                    <Skeleton.Text px="4" />
                                    <Skeleton px="4" my="4" rounded="md" startColor="primary.400" />
                                </VStack>
                            </Center>
                            : <>
                                {
                                    tableData?.length ?
                                        <>
                                            <DataTable.Header>
                                                <DataTable.Title style={{ width: 30 }}>#</DataTable.Title>
                                                <DataTable.Title style={{ width: 60 }}>Purpose</DataTable.Title>
                                                <DataTable.Title style={{ width: 60 }}>Loan type</DataTable.Title>
                                                <DataTable.Title style={{ width: 60 }}>Ammount</DataTable.Title>
                                                <DataTable.Title style={{ width: 80 }}>Date</DataTable.Title>
                                                <DataTable.Title style={{ width: 160 }}>Notice</DataTable.Title>
                                                <DataTable.Title style={{ width: 40 }}>Action</DataTable.Title>
                                            </DataTable.Header>
                                            {
                                                tableData?.map((tdata, index) => (
                                                    <>
                                                        {

                                                        }
                                                        <DataTable.Row key={index} style={styleData(tdata?.budget_type)}>
                                                            <DataTable.Cell style={{ width: 30, }}>{index + 1}</DataTable.Cell>
                                                            <DataTable.Cell style={{ width: 60 }}>{tdata?.purpose}</DataTable.Cell>
                                                            <DataTable.Cell style={{ width: 60 }}>{tdata?.budget_type}</DataTable.Cell>
                                                            <DataTable.Cell style={{ width: 60 }}>{tdata?.amount}</DataTable.Cell>
                                                            <DataTable.Cell style={{ width: 80 }}>{tdata?.date}</DataTable.Cell>
                                                            <DataTable.Cell style={{ width: 160 }}>{tdata?.note}</DataTable.Cell>
                                                            <IconButton
                                                                icon="delete"
                                                                size={20}
                                                                onPress={() => _alertIndex(tdata)}
                                                            />

                                                        </DataTable.Row>
                                                    </>
                                                ))
                                            }
                                        </> :
                                        <Heading>There are no budget for month!</Heading>
                                }
                            </>}
                    </DataTable>
                </ScrollView>
            </ScrollView>
            <View style={{ backgroundColor: '#682478', width: 400, height: 50 }}>
                <AddCashModal fetchData={fetchData} category={category} />
                <AddBudgetModal />
                <ReadBudgetModal />
            </View>
        </AnimatedColorBox>
    )
}

export default AboutScreen
