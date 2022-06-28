import React, { useState } from 'react'
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


const AddBudgetPurpose = () => {
    const instState = [{
        title: "Code",
        isCompleted: true
    }, {
        title: "Meeting with team at 9",
        isCompleted: false
    }, {
        title: "Check Emails",
        isCompleted: false
    }, {
        title: "Write an article",
        isCompleted: false
    }];
    const [list, setList] = React.useState(instState);
    const [inputValue, setInputValue] = React.useState("");
    // const toast = useToast();

    const addItem = title => {
        if (title === "") {
            // toast.show({
            //     title: "Please Enter Text",
            //     status: "warning"
            // });
            return;
        }

        setList(prevList => {
            return [...prevList, {
                title: title,
                isCompleted: false
            }];
        });
    };

    const handleDelete = index => {
        setList(prevList => {
            const temp = prevList.filter((_, itemI) => itemI !== index);
            return temp;
        });
    };

    const handleStatusChange = index => {
        setList(prevList => {
            const newList = [...prevList];
            newList[index].isCompleted = !newList[index].isCompleted;
            return newList;
        });
    };
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
                                }} onPress={() => handleStatusChange(itemI)}>
                                    {item.title}
                                </Text>
                                <IconButton size="sm" colorScheme="trueGray" icon={<Icon color="red" as={<AntDesign name="minus" />} size="sm" />} onPress={() => handleDelete(itemI)} />
                            </HStack>)}
                        </VStack>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    )

}

export default AddBudgetPurpose;