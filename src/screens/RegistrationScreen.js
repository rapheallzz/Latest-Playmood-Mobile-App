import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerStart } from '../features/authSlice';
import DynamicImage from '../components/DynamicImage';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, message } = useSelector(state => state.auth);

  const handleRegister = async () => {
    dispatch(registerStart());
    try {
      await dispatch(register(name, email, password));
      navigation.navigate('Home');
    } catch (error) {
      console.log('Registration error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DynamicImage />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
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
            onChangeText={text => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry
          />
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
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
