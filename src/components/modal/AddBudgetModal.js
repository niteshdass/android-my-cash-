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
import { TextInput, Alert, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import Input from '../form/Input';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';



const AddBudgetModal = ({ marginTop = -20 }) => {
    const [budgetModal, setBudgetModal] = useState(false);
    const [target_ammount, setTarget] = useState('');
    const [month, setMonth] = useState('');

    const onSubmitTarget = async () => {
        const d = new Date();
        let year = d.getFullYear();
        const user_data = await AsyncStorage.getItem('auth'); 
        // We have data!!
        let data = JSON.parse(user_data);
        if(year && target_ammount && month && data?.user?._id) {
            let target = {
                target_ammount,
                month,
                year,
                user_id: data?.user?._id
            }
            const result = await axios.post("https://my-cash-app.herokuapp.com/target/", target);
            if (result) {
                setBudgetModal(false)
            } else {
                Alert.alert('There are some issue')
            }
        }else {
            Alert.alert('There are some issue')
        }
    }

    return (
        <>
            <View style={{ marginTop }}>
                <Text style={{ color: '#ffff', fontWeight: 'bold', marginLeft: 155 }}>
                    ADD BUDGET
                </Text>
                <Fab
                    renderInPortal={false}
                    style={{ width: 35, height: 35, marginRight: 170 }}
                    icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                    colorScheme={useColorModeValue('blue', 'darkBlue')}
                    bg={useColorModeValue('primary.500', 'primary.400')}
                    onPress={() => setBudgetModal(true)}
                />
            </View>
            <Modal isOpen={budgetModal} onClose={() => setBudgetModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>
                        <Heading fontFamily="body" >
                            <IconM
                                name="calendar-heart"
                                style={{ color: '#7978B5', fontSize: 22, marginRight: 20 }}
                            /> Add monthly budget target
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <Input
                                onChangeText={text => setTarget(text)}
                                onFocus={() => console.log('error')}
                                iconName="currency-bdt"
                                label="Amount"
                                keyboardType="numeric"
                                placeholder="Enter your amount"
                            />
                            <Text style={{
                                marginVertical: 5,
                                fontSize: 14,
                                color: '#BABBC3',
                            }}>Select month</Text>
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
                                <Select selectedValue={month} minWidth="217" accessibilityLabel="Choose month" placeholder="Choose month" _selectedItem={{
                                    bg: "#F3F4FB",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setMonth(itemValue)}>

                                    <Select.Item value="1" label="January" />
                                    <Select.Item value="2" label="February" />
                                    <Select.Item value="3" label="March" />
                                    <Select.Item value="4" label="April" />
                                    <Select.Item value="5" label="May" />
                                    <Select.Item value="6" label="June" />
                                    <Select.Item value="7" label="July" />
                                    <Select.Item value="8" label="August" />
                                    <Select.Item value="9" label="September" />
                                    <Select.Item value="10" label="October" />
                                    <Select.Item value="11" label="November" />
                                    <Select.Item value="12" label="December" />
                                </Select>
                            </View>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                            <TouchableOpacity
                                onPress={() => {
                                    onSubmitTarget(false);
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
                                    setBudgetModal(false);
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
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default AddBudgetModal;