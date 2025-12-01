import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding Screen</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Skip</Text>
      </Pressable>
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
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#541011',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
