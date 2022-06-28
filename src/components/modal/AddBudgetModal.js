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
import { TextInput, Alert } from 'react-native';




const AddBudgetModal = () => {
    const [budgetModal, setBudgetModal] = useState(false);
    const [target_ammount, setTarget] = useState('');
    const [month, setMonth] = useState('');

    const onSubmitTarget = async () => {
        let target = {
            target_ammount,
            month
        }
        const result = await axios.post("https://nitesh-cash-api.herokuapp.com/target/", target);
        if (result) {
            setBudgetModal(false)
        } else {
            Alert.alert('There are some issue')
        }
    }

    return (
        <>
            <Fab
                renderInPortal={false}
                style={{ width: 50, height: 50, marginRight: 225 }}
                icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                colorScheme={useColorModeValue('blue', 'darkBlue')}
                bg={useColorModeValue('primary.500', 'primary.400')}
                onPress={() => setBudgetModal(true)}
            />

<Modal isOpen={budgetModal} onClose={() => setBudgetModal(false)}>
                        <Modal.Content maxWidth="400px">
                            <Modal.Header>
                                <Heading fontFamily="body" fontWeight={600} >Add your monthly target amount</Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <FormControl mt="3">
                                    <TextInput
                                        style={{
                                            padding: 10,
                                            borderBottomWidth: 1,
                                            borderRadius: 10,
                                            borderBottomColor: 'gray'
                                        }}
                                        onChangeText={setTarget}
                                        value={target_ammount}
                                        key="3"
                                        keyboardType="numeric"
                                        placeholder={'Amount'}
                                    />
                                    <Select selectedValue={month} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                        bg: "teal.600",
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
                                </FormControl>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                        setBudgetModal(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button style={{ backgroundColor: '#6b00b3' }} onPress={() => {
                                        onSubmitTarget();
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

export default AddBudgetModal;