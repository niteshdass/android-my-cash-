import React, { useEffect, useState } from 'react'
import {
    ScrollView,
    VStack,
    Center,
    Text,
    Box,
    Heading,
    HStack,
    Input,
    Icon,
    IconButton
} from 'native-base';
import { AntDesign } from '@expo/vector-icons'
import axios from 'axios';
import { AsyncStorage, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';



const AddBudgetPurpose = () => {
    const instState = [];
    const [list, setList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loan, setLoan] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = React.useState("");
    // const toast = useToast();

    const addItem = async (title, slug) => {
        if (title === "" || slug === "") {
            return;
        }
        title = title.toLowerCase();
        const user_data = await AsyncStorage.getItem('auth');
        let users = JSON.parse(user_data);
        const data = {
            name: title.toLowerCase(), slug, user_id: users?.user?._id
        }
        const result = await axios.post("https://my-cash-app.herokuapp.com/category", data);
        if (result) {
           if(slug === 'cash') {
                setList(prevList => {
                    return [...prevList, {
                        name: title,
                        id: result?.data?.user?._id
                    }];
                });
           } else if (slug === 'loan') {
                setLoan(prevList => {
                    return [...prevList, {
                        name: title,
                        id: result?.data?.user?._id
                    }];
                });
           }
        }

    };

    const handleDelete = async (index, item) => {
        let res = await axios.delete(`https://my-cash-app.herokuapp.com/category/${item?._id}`);
        if (res && item?.slug === "cash") {
            setList(prevList => {
                const temp = prevList.filter((_, itemI) => itemI !== index);
                return temp;
            });
        } else if (res && item?.slug === "loan") {
            setLoan(prevList => {
                const temp = prevList.filter((_, itemI) => itemI !== index);
                return temp;
            });
        }
    };
    const prepareData = (data) => {
        let loandata = [];
        let transaction = [];

        data?.map(item => {
            if(item?.slug === "cash") {
                transaction.push(item);
            } else if(item?.slug === "loan") {
                loandata.push(item);
            }
        })
        setList(transaction);
        setLoan(loandata)
    }
    const getCateGory = async () => {
        setLoading(true);
        const user_data = await AsyncStorage.getItem('auth');
        let users = JSON.parse(user_data);
        let _id = users?.user?._id;
        await axios.get(`https://my-cash-app.herokuapp.com/category/${_id}`)
            .then(async function (response) {
                response?.data && (
                    prepareData(response?.data)
                )
                setLoading(false);
            }).catch(function (error) {
                // handle error
                setLoading(false);
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getCateGory().then(() => setRefreshing(false));
    
      }, []);
    useEffect(() => {
        getCateGory()
    }, [])
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
            <Center w="100%">
                {loading ? <ActivityIndicator style={{ marginTop: 200 }} size="large" color="#2b7fed" /> :
                    <>
                        {
                            list?.length ? <>
                                <Box maxW="300" w="100%">
                                    <Heading style={{ marginBottom: 10, fontSize: 18, paddingTop: 20 }}>
                                        <IconM
                                            name={'view-list'}
                                            style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                        /> Add Transaction Slug
                                    </Heading>
                                    <VStack space={4}>
                                        <HStack space={2}>
                                            <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue} placeholder="Add Task" />
                                            <IconButton borderRadius="sm" variant="solid" icon={<Icon color="red" as={<AntDesign name="plus" />} size="sm" />} onPress={() => {
                                                addItem(inputValue, 'cash');
                                                setInputValue("");
                                            }} />
                                        </HStack>
                                        <VStack space={2}>
                                            {list.map((item, itemI) => <HStack bg="coolGray.200" w="100%" p={2} justifyContent="space-between" alignItems="center" key={item.title + itemI.toString()}>
                                                <Icon color="red" as={<AntDesign name="check" />} size="sm" />
                                                <Text width="100%" flexShrink={1} textAlign="left" mx="2" _light={{
                                                    color: "coolGray.800"
                                                }} _dark={{
                                                    color: "coolGray.50"
                                                }}>
                                                    {item.name}
                                                </Text>
                                                <IconButton size="sm" colorScheme="trueGray" icon={<Icon color="red" as={<AntDesign name="minus" />} size="sm" />} onPress={() => handleDelete(itemI, item)} />
                                            </HStack>)}
                                        </VStack>
                                    </VStack>

                                    <Heading style={{ marginBottom: 10, fontSize: 18, paddingTop: 20 }}>
                                        <IconM
                                            name={'account-circle-outline'}
                                            style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                        /> Add Borrower
                                    </Heading>
                                    <VStack space={4}>
                                        <HStack space={2}>
                                            <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue} placeholder="Add Task" />
                                            <IconButton borderRadius="sm" variant="solid" icon={<Icon color="red" as={<AntDesign name="plus" />} size="sm" />} onPress={() => {
                                                addItem(inputValue, 'loan');
                                                setInputValue("");
                                            }} />
                                        </HStack>
                                        <VStack space={2}>
                                            {loan.map((item, itemI) => <HStack bg="coolGray.200" w="100%" p={2} justifyContent="space-between" alignItems="center" key={item.title + itemI.toString()}>
                                                <Icon color="red" as={<AntDesign name="check" />} size="sm" />
                                                <Text width="100%" flexShrink={1} textAlign="left" mx="2" _light={{
                                                    color: "coolGray.800"
                                                }} _dark={{
                                                    color: "coolGray.50"
                                                }}>
                                                    {item.name}
                                                </Text>
                                                <IconButton size="sm" colorScheme="trueGray" icon={<Icon color="red" as={<AntDesign name="minus" />} size="sm" />} onPress={() => handleDelete(itemI, item)} />
                                            </HStack>)}
                                        </VStack>
                                    </VStack>
                                </Box>
                            </> : <>
                                <Heading>Nothing to found !!</Heading>
                            </>
                        }

                    </>
                }
            </Center>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

});

export default AddBudgetPurpose;
