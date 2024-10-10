import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryBar, VictoryGroup, VictoryAxis } from 'victory-native';

const DATA = [
  { name: 'Meta A', targetValue: 100, achievedValue: 75 },
  { name: 'Meta B', targetValue: 90, achievedValue: 60 },
  { name: 'Meta C', targetValue: 80, achievedValue: 85 },
  { name: 'Meta D', targetValue: 70, achievedValue: 55 },
];

const TargetReportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Percentual atingido x Meta </Text>

      <VictoryChart
        domainPadding={{ x: 50, y: 50 }}
        padding={{ top: 40, bottom: 15, left: 60, right: 50 }}
      >
        <VictoryGroup offset={20} colorScale={"qualitative"} horizontal barRatio={0.6}>
          <VictoryBar
            data={DATA}
            x="name"
            y="targetValue"
            barWidth={15}
            style={{ data: { fill: "red" } }}
          />
          <VictoryBar
            data={DATA}
            x="name"
            y="achievedValue"
            barWidth={15}
            style={{ data: { fill: "blue" } }}
          />
        </VictoryGroup>

        {/* Eixo das metas */}
        <VictoryAxis
          dependentAxis
          domain={[0, 110]} 
          style={{ tickLabels: {  dy: -10 } }}
        />

        {/* Eixo dos valores */}
        <VictoryAxis 
        offsetY={40}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginStart: 0,
    marginEnd: 50
  },
});

export default TargetReportScreen;
