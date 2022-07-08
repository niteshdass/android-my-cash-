import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CheckIcon } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const COLORS = {
    white: '#fff',
    black: '#000',
    blue: '#5D5FEE',
    grey: '#BABBC3',
    light: '#F3F4FB',
    darkBlue: '#7978B5',
    red: 'red',
};
const Select = ({
    label,
    iconName,
    error,
    password,
    value = "",
    placeholder = "",
    onChangeText,
    onFocus = () => { },
    ...props
}) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={style.label}>{label}</Text>
            <View
                style={[
                    style.inputContainer,
                    {
                        borderColor: error
                            ? COLORS.red
                            : isFocused
                                ? COLORS.darkBlue
                                : COLORS.light,
                        alignItems: 'center',
                    },
                ]}>
                <Icon
                    name={iconName}
                    style={{ color: COLORS.darkBlue, fontSize: 22, marginRight: 10 }}
                />

                <Select selectedValue={value} accessibilityLabel={placeholder} placeholder={placeholder} _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => onChangeText(itemValue)}>
                    <Select.Item label="Credit" value="credit" />
                    <Select.Item label="Debit" value="debit" />
                </Select>
            </View>
            {error && (
                <Text style={{ marginTop: 7, color: COLORS.red, fontSize: 12 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 14,
        color: COLORS.grey,
    },
    inputContainer: {
        height: 55,
        backgroundColor: COLORS.light,
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
    },
});

export default Select;