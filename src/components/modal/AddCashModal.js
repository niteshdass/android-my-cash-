
import React, { useState } from 'react'
import axios from 'axios';
import {
    Fab,
    Icon,
    Select,
    CheckIcon,
    Button,
    Modal,
    FormControl,
    useColorModeValue,
    Heading
} from 'native-base';
import { AntDesign } from '@expo/vector-icons'
import { TextInput, Alert, AsyncStorage, View } from 'react-native';
import Input from '../form/Input';


const AddCashModal = ({ fetchData, category }) => {
    const [addModal, setAddModal] = useState(false);
    const [budget_type, setType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    // date formate
    function formatDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    // save modal data
    const saveAddModal = async () => {
        if (amount?.length && purpose?.length && budget_type?.length && note?.length) {
            let date = formatDate();
            const user_data = await AsyncStorage.getItem('auth');
            const d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let users = JSON.parse(user_data);
            const budget = {
                amount, purpose, budget_type, date, note, user_id: users?.user?._id, year, month
            }
            setAddModal(!addModal);
            const result = await axios.post("https://my-cash-app.herokuapp.com/budget/create", budget);
            if (result) {
                console.log(result);
                fetchData();
                setAddModal(!addModal);
            }

        } else {
            Alert.alert("All fields are required!");
        }

        setAmount('');
        setNote('');
        setPurpose('');
        setType('');
    }
    return (
        <>
            <View style={{ marginTop: 61 }}>
                <Fab
                    renderInPortal={false}
                    style={{ width: 40, height: 40, marginRight: 320 }}
                    icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                    colorScheme={useColorModeValue('blue', 'darkBlue')}
                    bg={useColorModeValue('blue.500', 'blue.400')}
                    onPress={() => setAddModal(true)}
                />
            </View>

            <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>
                        <Heading fontFamily="body" fontWeight={600} >List your debit/credit</Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <Select selectedValue={purpose} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setPurpose(itemValue)}>
                                {
                                    category?.map((item) => (
                                        <Select.Item label={item?.name} value={item?.name} />
                                    ))
                                }
                            </Select>
                            <TextInput
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderRadius: 10,
                                    borderBottomColor: 'gray'
                                }}
                                onChangeText={setAmount}
                                value={amount}
                                key="3"
                                keyboardType="numeric"
                                placeholder={'Amount'}
                            />
                            <Select selectedValue={budget_type} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setType(itemValue)}>
                                <Select.Item label="Credit" value="credit" />
                                <Select.Item label="Debit" value="debit" />
                            </Select>
                            {/* <TextInput
                                style={{
                                    borderBottomWidth: 1,
                                    padding: 10,
                                    borderRadius: 10,
                                    borderBottomColor: 'gray',

                                }}
                                onChangeText={setNote}
                                value={note}
                                key="2"
                                placeholder={'Please enter your note'}
                            /> */}
                            <Input
                                onChangeText={text => setNote(text)}
                                onFocus={() => console.log('error')}
                                iconName="note"
                                label="Note"
                                placeholder="Enter your note"
                            />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setAddModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button style={{ backgroundColor: '#6b00b3' }} onPress={() => {
                                saveAddModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default AddCashModal;