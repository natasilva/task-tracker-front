import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>LOGIN</Card.Title>
        <Text style={styles.text}>LOGIN</Text>   
        <TextInput
          style={styles.input}
        />
        <TextInput
          style={styles.input}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />   
        <Button
          title="ENTRAR"
          onPress={() => navigation.navigate('Results')}
        />
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
  text: {
    fontSize: 20,
  },
});

export default LoginScreen;
