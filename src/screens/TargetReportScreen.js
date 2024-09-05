import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TargetReportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Target Report Screen!</Text>
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

export default TargetReportScreen;
