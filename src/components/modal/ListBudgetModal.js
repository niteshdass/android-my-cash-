import React, { useState } from 'react'
import axios from 'axios';
import {
    Fab,
    Icon,
    Modal,
    useColorModeValue,
    Heading
} from 'native-base';
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';

const ReadBudgetModal = () => {
    const [monthModal, setMontModal] = useState(false);
    const [month_target, setMonthTarget] = useState([]);
    var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    const fetchMonthTarget = async () => {
        const resp = await fetch("https://nitesh-cash-api.herokuapp.com/target/");
        const data = await resp.json();
        if (data?.length) {
            setMonthTarget(data.reverse());
        }
    }


    React.useEffect(() => {
        fetchMonthTarget();
    }, []);
    return (
        <>

            <Fab
                renderInPortal={false}
                style={{ width: 50, height: 50, marginRight: 170 }}
                icon={<Icon color="white" as={<AntDesign name="eye" />} size="sm" />}
                colorScheme={useColorModeValue('blue', 'darkBlue')}
                bg={useColorModeValue('primary.500', 'primary.400')}
                onPress={() => setMontModal(true)}
            />

            <Modal isOpen={monthModal} onClose={() => setMontModal(false)}>
                <Modal.Content maxH="412">
                    <Modal.Header>
                        <Modal.CloseButton />
                        <Heading fontFamily="body" fontWeight={'bold'} fontSize={22} >Your monthly target amount list</Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <SafeAreaView style={styles.container}>
                            {
                                month_target?.map((data_item) => (
                                    <View style={styles.item} key={data_item?._id}>

                                        <Text style={styles.title}>
                                            <Icon color="white" as={<AntDesign name="calendar" />} size="sm" />
                                            /  {mL[data_item.month - 1]} = {data_item.target_ammount} </Text>
                                    </View>
                                ))
                            }

                        </SafeAreaView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: '#db0771',
        height: 'auto',
        width: 270,
        justifyContent: 'center',
        marginVertical: 8,
        padding: 10,
        marginRight: 14,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold"
    },
});
export default ReadBudgetModal;