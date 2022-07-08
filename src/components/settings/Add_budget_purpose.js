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
import { AsyncStorage } from 'react-native';


const AddBudgetPurpose = () => {
    const instState = [];
    const [list, setList] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    // const toast = useToast();

    const addItem = async title => {
        if (title === "") {
            return;
        }

        const user_data = await AsyncStorage.getItem('auth');
        let users = JSON.parse(user_data);
        const data = {
            name: title.toLowerCase(), slug: 'cash', user_id: users?.user?._id
        }
        const result = await axios.post("https://my-cash-app.herokuapp.com/category", data);
        if (result) {
            setList(prevList => {
                return [...prevList, {
                    name: title,
                    id: result?.data?.user?._id
                }];
            });
        }

    };

    const handleDelete = async (index, item) => {
       let res = await axios.delete(`https://my-cash-app.herokuapp.com/category/${item?._id}`);
        if(res) {
            setList(prevList => {
                const temp = prevList.filter((_, itemI) => itemI !== index);
                return temp;
            });
        }
    };

    const getCateGory = async () => {
        const user_data = await AsyncStorage.getItem('auth');
        let users = JSON.parse(user_data);
        let _id = users?.user?._id;
        await axios.get(`https://my-cash-app.herokuapp.com/category/${_id}`)
            .then(async function (response) {
                response?.data && (
                    setList(response?.data)
                )
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };
    useEffect(() => {
        getCateGory()
    }, [])
    return (
        <ScrollView>
            <Center w="100%">
                <Box maxW="300" w="100%">
                    <VStack space={4}>
                        <HStack space={2}>
                            <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue} placeholder="Add Task" />
                            <IconButton borderRadius="sm" variant="solid" icon={<Icon color="red" as={<AntDesign name="plus" />} size="sm" />} onPress={() => {
                                addItem(inputValue);
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
                </Box>
            </Center>
        </ScrollView>
    )

}

export default AddBudgetPurpose;
