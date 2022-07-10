
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { IconButton, Flex, Center } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const List = ({ loanData, getLoan }) => {
    const onPressDeletedata = async (data) => {
        await axios.delete(`https://my-cash-app.herokuapp.com/loan/${data._id}`);
        getLoan();
     }
    const renderItem = ({ item }) => (
        <View style={[styles.item, { backgroundColor: item.loan_type === 'lender' ? '#c6cecf' : 'white' }]}>
            <View style={styles.marginLeft}>
                <View style={[styles.menu, { backgroundColor: 'green' }]}></View>
                <View style={[styles.menu, { backgroundColor: 'white' }]}></View>
                <View style={[styles.menu, { backgroundColor: 'red' }]}></View>
            </View>
            <Text style={styles.text}> {item.name.charAt(0).toUpperCase() + item.name.slice(1)} </Text>
            <View style={{ minWidth: 140 }}>
                <Text>
                    {item?.loan_type}
                </Text>
                <Text>
                    {item?.amount}
                </Text>
            </View>
            <View>
                <Flex direction="row" mb="2.5" mt="1.5">
                <IconButton size="sm" colorScheme="trueGray" icon={<IconM
                    name={'pencil'}
                    style={{ color: '#7978B5', fontSize: 22 }}
                />} onPress={() => onPressLearnMore()} />
                <IconButton size="sm" colorScheme="trueGray" icon={<IconM
                    name={'trash-can'}
                    style={{ color: 'red', fontSize: 22 }}
                />} onPress={() => onPressDeletedata(item)} />

                </Flex>
      

            </View>
        </View>
    )

    return (
        <View style={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.headerText}> Loan list </Text>
            </View>
            <FlatList
                data={loanData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
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
        minWidth: 150,
        marginLeft: 10
        ,
    }
})
export default List;
