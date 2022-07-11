import React, { useState } from 'react'
import axios from 'axios';
import {
    ScrollView,
    VStack,
    useColorModeValue,
    Center,
    Skeleton, Text, Heading, View, Fab, Icon, Flex, IconButton
} from 'native-base';
import { DataTable } from 'react-native-paper';
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'
import AddCashModal from '../components/modal/AddCashModal.js';
import AddBudgetModal from '../components/modal/AddBudgetModal';
import ReadBudgetModal from '../components/modal/ListBudgetModal'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncStorage, Alert, RefreshControl, FlatList, StyleSheet } from 'react-native';
const Data = [
    { id: 1, text: 'Item One', color: 'red' },
    { id: 2, text: 'Item Two', color: 'blue' },
    { id: 3, text: 'Item Three', color: 'yellow' },
    { id: 4, text: 'Item Four', color: 'green' },
    { id: 5, text: 'Item Five', color: 'orange' },
    { id: 6, text: 'Item Six', color: 'red' },
    { id: 7, text: 'Item Seven', color: 'blue' },
    { id: 8, text: 'Item Eight', color: 'yellow' },
    { id: 9, text: 'Item Nine', color: 'green' },
    { id: 10, text: 'Item Ten', color: 'orange' },
    { id: 11, text: 'Item Eleven', color: 'red' },
    { id: 12, text: 'Item Twelve TwelveTwelv Twelve Twelve Twelve Twelve Twelve Twelve', color: 'blue' },
    { id: 13, text: 'Item Thirteen', color: 'yellow' },
    { id: 14, text: 'Item Fourteen', color: 'green' },
    { id: 15, text: 'Item Fifteen', color: 'orange' },
]
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
            "Delete the transaction.",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => deleteBudget(index) }
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

    const renderItem = ({ item }) => (
        <View style={[styles.item, { backgroundColor: item.budget_type === 'credit' ? '#c6cecf' : 'white' }]}>
            <View style={styles.marginLeft}>
                <View style={[styles.menu, { backgroundColor: 'green' }]}></View>
                <View style={[styles.menu, { backgroundColor: 'white' }]}></View>
                <View style={[styles.menu, { backgroundColor: 'red' }]}></View>
            </View>
            <Text style={styles.text}> {item?.purpose.charAt(0).toUpperCase() + item?.purpose.slice(1)} </Text>

            <View style={{ minWidth: 80 }}>
                <Text>
                    {item?.budget_type}
                </Text>
                <Text>
                    {item?.date}
                </Text>
            </View>
            <Text style={styles.text}><IconM
                name={'currency-bdt'}
                style={{ color: 'black', fontSize: 22, marginRight: 10 }}
            />{item?.amount}</Text>
            <Text style={{ minWidth: 180 }}>{item?.note}</Text>

            <View>
                <Flex direction="row" mb="2.5" mt="1.5">
                    {/* <IconButton size="sm" colorScheme="trueGray" icon={<IconM
                    name={'pencil'}
                    style={{ color: '#7978B5', fontSize: 22 }}
                />} onPress={() => onPressLearnMore()} /> */}
                    <IconButton size="sm" colorScheme="trueGray" icon={<IconM
                        name={'trash-can'}
                        style={{ color: 'red', fontSize: 22 }}
                    />} onPress={() => _alertIndex(item)} />

                </Flex>


            </View>
        </View>
    )

    return (
        <AnimatedColorBox
            flex={1}
            bg={useColorModeValue('green.50', 'warmGray.900')}
            w="full"
        >
            <Masthead
                title="Manage your transaction"
                image={require('../assets/trans.jpg')}
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
                                    <View style={styles.header}>
                                                    <Text style={styles.headerText}>Your this month transaction list </Text>
                                                </View>
                <ScrollView
                    borderTopLeftRadius="20px"
                    borderTopRightRadius="20px"
                    bg={useColorModeValue('warmGray.50', 'primary.900')}
                    mt="-43px"
                    horizontal={true}

                >
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
                                            <View style={styles.contentContainer}>
                                                <FlatList
                                                    data={tableData}
                                                    keyExtractor={(item) => item._id.toString()}
                                                    renderItem={renderItem}
                                                />
                                            </View>
                                        </> :
                                        <Heading style={{ padding: 20, color: 'red'}}>There are no budget for month!</Heading>
                                }
                            </>}
                </ScrollView>
            </ScrollView>
            <View style={{ backgroundColor: '#0b68e0', width: 400, height: 55 }}>
                <AddCashModal fetchData={fetchData} category={category} />
                <AddBudgetModal marginTop={-20} />
                <ReadBudgetModal />
            </View>
        </AnimatedColorBox>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 100,
        marginTop: -30,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 40
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    item: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        alignItems: 'center',
    },
    marginLeft: {
        marginLeft: 5,
    },
    menu: {
        width: 20,
        height: 2,
        backgroundColor: '#111',
        margin: 2,
        borderRadius: 3,
    },
    text: {
        marginVertical: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        minWidth: 140,
        marginLeft: 10
        ,
    }
})

export default AboutScreen
