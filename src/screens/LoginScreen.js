import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { login } from '../features/authSlice';
import playmood from '../../assets/PLAYMOOD_DEF.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, isSuccess, message } = useSelector(state => state.auth);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) {
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigation.navigate('Home');
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={playmood} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => {
            setEmail(text);
            validateEmail(text);
          }}
          value={email}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={text => {
            setPassword(text);
            validatePassword(text);
          }}
          value={password}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.loginButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </Pressable>
        {isError && <Text style={styles.errorText}>{message}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <Pressable style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.register}>Create an Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    width: 350,
    height: 50,
    marginBottom: 60,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#541011',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'grey',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  register: {
    color: '#541011',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
