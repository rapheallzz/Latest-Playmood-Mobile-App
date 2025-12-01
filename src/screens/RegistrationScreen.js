import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image, ScrollView } from 'react-native';
import playmood from '../../assets/PLAYMOOD_DEF.png';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerStart, registerSuccess, registerFailure } from '../features/authSlice';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
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

  const handleRegister = async () => {
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) {
      return;
    }

    dispatch(registerStart());
    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigation.navigate('Onboarding');
    } catch (error) {
      console.log('Registration error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.content}>
        <Image source={playmood} style={styles.logo} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={text => setName(text)}
            value={name}
          />
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
          <Pressable style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            <Text style={styles.registerButtonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
          </Pressable>
          {isError && <Text style={styles.errorText}>{message}</Text>}
        </View>
      </ScrollView>
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
  content: {
    width: '100%',
    marginLeft:70,
    marginTop:120,
  },
  logo: {
    width: 310,
    height: 80,
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: '#541011',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
