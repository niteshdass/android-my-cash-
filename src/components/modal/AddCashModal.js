
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
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign } from '@expo/vector-icons'
import { TextInput, Alert, AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
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
            <View style={{ marginTop: 35 }}>
                <Text style={{color: '#ffff', fontWeight: 'bold', marginLeft: 15}}>
                    TRANSACTION
                </Text>
                <Fab
                    renderInPortal={false}
                    style={{ width: 35, height: 35, marginRight: 300 }}
                    icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                    colorScheme={useColorModeValue('blue', 'darkBlue')}
                    bg={useColorModeValue('blue.500', 'blue.400')}
                    onPress={() => setAddModal(true)}
                />
            </View>

            <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>
                        <Heading fontFamily="body" >
                            <IconM
                                name="calendar-heart"
                                style={{ color: '#7978B5', fontSize: 22, marginRight: 20 }}
                            />
                            List your transaction
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <Text style={{
                                marginVertical: 5,
                                fontSize: 14,
                                color: '#BABBC3',
                            }}>Purpose</Text>
                            <View
                                style={[
                                    {
                                        height: 55,
                                        backgroundColor: '#F3F4FB',
                                        flexDirection: 'row',
                                        paddingHorizontal: 15,
                                        borderWidth: 0.5,
                                        paddingBottom: 3
                                    },
                                    {
                                        borderColor: '#F3F4FB',
                                        alignItems: 'center',
                                    },
                                ]}>
                                <IconM
                                    name="calendar-heart"
                                    style={{ color: '#7978B5', fontSize: 22, marginRight: 10 }}
                                />
                                <Select selectedValue={purpose} minWidth="217" accessibilityLabel="Choose purpose" placeholder="Choose Service" _selectedItem={{
                                    bg: "#F3F4FB",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setPurpose(itemValue)}>
                                    {
                                        category?.map((item) => (
                                            <Select.Item label={item?.name} value={item?.name} />
                                        ))
                                    }
                                </Select>
                            </View>
                            <Input
                                onChangeText={text => setAmount(text)}
                                onFocus={() => console.log('error')}
                                iconName="currency-bdt"
                                label="Amount"
                                placeholder="Enter your amount"
                            />
                            <Text style={{
                                marginVertical: 5,
                                fontSize: 14,
                                color: '#BABBC3',
                            }}>Purpose</Text>
                            <View
                                style={[
                                    {
                                        height: 55,
                                        backgroundColor: '#F3F4FB',
                                        flexDirection: 'row',
                                        paddingHorizontal: 15,
                                        borderWidth: 0.5,
                                        paddingBottom: 3
                                    },
                                    {
                                        borderColor: '#F3F4FB',
                                        alignItems: 'center',
                                    },
                                ]}>
                                <IconM
                                    name="calendar-heart"
                                    style={{ color: '#7978B5', fontSize: 22, marginRight: 10 }}
                                />
                                <Select selectedValue={budget_type} minWidth="217" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setType(itemValue)}>
                                    <Select.Item label="Credit" value="credit" />
                                    <Select.Item label="Debit" value="debit" />
                                </Select>
                            </View>
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
                        <TouchableOpacity
                            onPress={() => {
                                saveAddModal(false);
                            }}
                            activeOpacity={0.7}
                            style={{
                                height: 35,
                                width: '100%',
                                backgroundColor: '#5D5FEE',
                                marginVertical: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: '#fcfcff', fontWeight: 'bold', fontSize: 18 }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setAddModal(false);
                            }}
                            activeOpacity={0.7}
                            style={{
                                height: 35,
                                width: '100%',
                                backgroundColor: 'red',
                                marginVertical: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: '#fcfcff', fontWeight: 'bold', fontSize: 18 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        {/* <Button.Group space={2}>
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
                        </Button.Group> */}
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default AddCashModal;