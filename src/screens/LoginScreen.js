import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Login Screen!</Text>
      <Button
        title="Ver Resultados"
        onPress={() => navigation.navigate('Results')}
      />
      <Button
        title="Ver relatório de metas"
        onPress={() => navigation.navigate('TargetReport')}
      />
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
