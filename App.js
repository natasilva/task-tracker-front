import React from 'react';
import { StyleSheet } from 'react-native';
import AppRoutes from './src/route';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Hello world</Text>
    //   <Button
    //     title="Go to Login Screen"
    //     onPress={() => navigation.navigate('Login')}
    //   />    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
