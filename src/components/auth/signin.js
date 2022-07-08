import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Keyboard, Platform, StyleSheet, Text, TextInput, View, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../form/Input';


const Signin = ({ callBack, auth }) => {

  const emailInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  const firstnameInputRef = React.createRef();
  const [signin, setSignin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailError, setShowEmailError] = useState("");
  const [showPasswordError, setShowPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitPressed = async () => {
    setShowEmailError(email.length < 4);
    setShowPasswordError(password.length < 4);
    if (password?.length && email?.length) {
      setLoading(true);
      const data = {
        email, password
      }
      const result = await axios.post("https://my-cash-app.herokuapp.com/api/signin", data);
      if (result) {
        setLoading(false)
        try {
          await AsyncStorage.setItem(
            'auth',
            JSON.stringify(result.data)
          );
          auth(true);
        } catch (error) {
          // Error saving data
        }
      }
      setLoading(false);
    }
    Keyboard.dismiss();
  }

  const showError = (data, message) => {
    return data ? <Text style={styles.errorText}>{message}</Text> : <Text></Text>
  }

  const changeLayout = () => {
    setSignin(!signin);
  }
  const getTitle = () => {
    return loading ? 'Signing...' : 'Signin';
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentOffset={{ x: 0, y: 24 }}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: 24 }}
      contentInsetAdjustmentBehavior="always"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableOnAndroid={true}
      extraHeight={32}
      extraScrollHeight={Platform.OS == "android" ? 32 : 0}
      enableResetScrollToCoords={false}
    >
      <View style={styles.container}>

        <Text style={styles.header}>
          <Icon
            name="account-box"
            style={{ color: "#7978B5", fontSize: 32, marginRight: 10 }}
          /> Signin</Text>

        <View style={styles.inputTextWrapper}>
          <Input
            onChangeText={text => setEmail(text)}
            onFocus={() => console.log('error')}
            iconName="email-check"
            returnKeyType="next"
            label="Email"
            placeholder="Enter your email"
          />
        </View>
        {showError(showEmailError, 'Please enter a password.')}
        <View style={styles.inputTextWrapper}>
          <Input
            onChangeText={text => setPassword(text)}
            onFocus={() => console.log('error')}
            iconName="lock-check"
            returnKeyType="next"
            label="Password"
            placeholder="Enter your password"
          />
          {
            showError(showPasswordError, 'Please enter a password.')
          }
        </View>

        <View style={styles.btnContainer}>
          <Button title={getTitle()} onPress={submitPressed} />
        </View>
        <View style={styles.btnContainer}>
          <Button  title="Registration" onPress={callBack} />
        </View>

      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 36,
    padding: 24,
    margin: 12,
    textAlign: "center",
  },
  inputTextWrapper: {
    marginBottom: 24,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    paddingRight: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 36,
  }
});
export default Signin;