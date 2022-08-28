import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Keyboard, Platform, StyleSheet, Text, TextInput, View, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Signin from './signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../form/Input';

const RegistrationScreen = ({ callBack }) => {

  const emailInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  const firstnameInputRef = React.createRef();
  const [signin, setSignin] = useState(false);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [showEmailError, setShowEmailError] = useState("");
  const [showPasswordError, setShowPasswordError] = useState("");
  const [showFirstnameError, setShowFirstnameError] = useState("");
  const [activeIndex, setActiveIndex] = useState()

  const inputs = () => {
    return [
      emailInputRef,
      passwordInputRef,
      firstnameInputRef
    ];
  };

  const onInputFocus = () => {
    setActiveIndex(getActiveInputIndex())
  }


  const getActiveInputIndex = () => {
    const activeIndex = inputs().findIndex((input) => {
      if (input.current == null) {
        return false;
      }
      return input.current.isFocused();
    });
    return activeIndex;
  }


  const setFocus = (textInputRef, shouldFocus) => {
    if (shouldFocus) {
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    } else {
      textInputRef.current.blur();
    }
  }

  function containsNumber(str) {
    return /\d/.test(str);
  }

  const submitPressed = async () => {
    let regex = /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g
    setShowEmailError(!email.match(regex));
    setShowPasswordError(password.length < 7 || !containsNumber(password));
    console.log(email.match(regex), 'regex');
    setShowFirstnameError(firstname.length < 4);
    if (firstname?.length && password?.length > 7 && email.match(regex) && containsNumber(password)) {
      setLoading(true);
      setError(false);
      const data = {
        email, password, name: firstname
      }
      try {
        const result = await axios.post("https://my-cash-app.herokuapp.com/api/signup", data);
        setLoading(false);
        if (result?.data?.user) {
          try {
            await AsyncStorage.setItem(
              'auth',
              JSON.stringify(result.data)
            );
            callBack(true);
          } catch (error) {
            // Error saving data
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
        setLoading(false);

      }
    }


    Keyboard.dismiss();
  }

  const showError = (data, message) => {
    return data ? <Text style={styles.errorText}>{message}</Text> : <Text></Text>
  }

  const changeLayout = () => {
    setSignin(!signin);
  }

  const getLabel = (data, loading) => {
    return loading ? `${data}...` : data;
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
      {
        signin ? <>
          <Signin callBack={changeLayout} auth={callBack} />
        </> :
          <View style={styles.container}>

            <Text style={styles.header}>
              <Icon
                name="account-box"
                style={{ color: "#7978B5", fontSize: 32, marginRight: 10 }}
              /> Registration</Text>

            <View style={styles.inputTextWrapper}>
              <Input
                onChangeText={text => setFirstname(text)}
                onFocus={() => console.log('error')}
                iconName="account-box"
                returnKeyType="next"
                label="Name"
                placeholder="First Name"
              />
              {
                showError(showFirstnameError, 'Please enter your first name.')
              }
            </View>
            <View style={styles.inputTextWrapper}>
              <Input
                onChangeText={text => setEmail(text)}
                onFocus={() => console.log('error')}
                iconName="email-check"
                returnKeyType="next"
                label="Email"
                placeholder="Enter your email"
              />
                 {showError(showEmailError, 'Please enter a valid email.')}
            </View>
         
            <View style={styles.inputTextWrapper}>
              <Input
                onChangeText={text => setPassword(text)}
                onFocus={() => console.log('error')}
                iconName="lock-check"
                returnKeyType="next"
                label="Password"
                placeholder="Password length must be 8 digit"
              />
              {
                showError(showPasswordError, 'Password length must be 8 digit and must contain a number.')
              }
            </View>

            {
                showError(error, 'Email is already taken !')
              }
            <View style={styles.btnContainer}>
              <Button title={getLabel("Register", loading)} onPress={submitPressed} />
            </View>
            <View style={styles.btnContainer}>
              <Button title="Signin" onPress={changeLayout} />
            </View>

          </View>
      }
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
    marginTop: 20,
  }
});
export default RegistrationScreen;