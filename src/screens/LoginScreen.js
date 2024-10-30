import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Image } from 'react-native-elements';
import axios from "axios";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async () => {
    const API_URL = process.env.API_URL;

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        password,
        cpf: email
      });
    
      const data = response.data
    
      if (data.user) {
        return navigation.replace(data.user.is_admin ? "TargetReport" : "Results")
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Image
          source={require('../../assets/pac.png')}
          style={styles.image}
        />

        <Card.Title>LOGIN</Card.Title>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.rectangularButton}
          onPress={() => login()}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 50,
    marginEnd: "auto",
    marginStart: "auto",    
    width: 150,
    height: 60,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 170,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 5,
  },
  card: {
    width: 350,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangularButton: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;