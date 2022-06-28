import React, { useState } from 'react'
import axios from 'axios';
import {
    ScrollView,
    VStack,
    useColorModeValue,
    Center,
    Skeleton, Text
} from 'native-base';
import { DataTable, IconButton } from 'react-native-paper';
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'
import AddCashModal from '../components/modal/AddCashModal.js';
import AddBudgetModal from '../components/modal/AddBudgetModal';
import ReadBudgetModal from '../components/modal/ListBudgetModal'

const AboutScreen = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [tableData, setTableData] = useState([]);

    // budget fetch
    const fetchData = async () => {
        setLoading(true);
        const resp = await fetch("https://nitesh-cash-api.herokuapp.com/budget/");
        const data = await resp.json();
        if (data?.length) {
            setTableData(data.reverse());
        }
        setLoading(false);
    };


    // delete budget
    const deleteBudget = async (data) => {
        await axios.delete(`https://nitesh-cash-api.herokuapp.com/budget/${data._id}`);
        fetchData();
    }
    // confirmation for delate
    const _alertIndex = (index) => {
        Alert.alert(
            "Delete budget",
            "Are you sure you wat to delete this budget?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "No"
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

    React.useEffect(() => {
        fetchData();
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
            >
                <VStack
                    space={4}
                    bg={useColorModeValue('warmGray.50', 'primary.900')}
                    mt="-53px"
                    pt="30px"
                    p={20}
                    m={7}
                >
                    <AddCashModal fetchData={fetchData} />
                    <AddBudgetModal />
                    <ReadBudgetModal />

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
                            </>}
                    </DataTable>
                </ScrollView>
            </ScrollView>
        </AnimatedColorBox>
    )
}

export default AboutScreen
