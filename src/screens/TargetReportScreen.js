import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryAxis,
} from "victory-native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

const TargetReportScreen = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id_user, setUser] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const showStartPicker = () => {
    setStartPickerVisibility(true);
  };

  const hideStartPicker = () => {
    setStartPickerVisibility(false);
  };

  const handleConfirmStart = (date) => {
    setStartDate(date);
    hideStartPicker();
  };

  const showEndPicker = () => {
    setEndPickerVisibility(true);
  };

  const hideEndPicker = () => {
    setEndPickerVisibility(false);
  };

  const handleConfirmEnd = (date) => {
    setEndDate(date);
    hideEndPicker();
  };

  useEffect(() => {
    const API_URL = process.env.API_URL;

    const listUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/`, {
          params: {
            // admin: false
          },
        });
        console.log(response.data)
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    listUsers()
  }, [])


  useEffect(() => {
    const getReport = async () => {
      try {
        const API_URL = process.env.API_URL;
        const response = await axios.get(`${API_URL}/targets/report`, {
          params: {
            id_user: id_user,
            initialDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getReport();
  }, [id_user, startDate, endDate]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Container dos inputs de data */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={showStartPicker} style={styles.input}>
            <Text>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={showEndPicker} style={styles.input}>
            <Text>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input de atendente */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={id_user}
          style={styles.picker}
          onValueChange={(id) => setUser(id)}
        >
          {users.map((user) => (
            <Picker.Item
              key={user.id}
              label={user.name}
              value={user.id}
            />
          ))}
        </Picker>
      </View>

      {/* Modal para Data Inicial */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={handleConfirmStart}
        onCancel={hideStartPicker}
      />

      {/* Modal para Data Final */}
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={handleConfirmEnd}
        onCancel={hideEndPicker}
      />

      <Text style={styles.text}>Percentual atingido x Meta </Text>
      <VictoryChart
        domainPadding={{ x: 50, y: 50 }}
        padding={{ top: 10, bottom: 15, left: 80, right: 30 }}
      >
        <VictoryGroup
          offset={15}
          colorScale={"qualitative"}
          horizontal
          barRatio={0.8}
        >
          <VictoryBar
            data={data}
            x="name"
            y="targetvalue"
            barWidth={15}
            style={{ data: { fill: "red" } }}
          />
          <VictoryBar
            data={data}
            x="name"
            y="achievedvalue"
            barWidth={15}
            style={{ data: { fill: "blue" } }}
          />
        </VictoryGroup>

        <VictoryAxis
          dependentAxis
          domain={[0, 110]}
          style={{
            tickLabels: { dy: -10 },
            grid: { stroke: "grey", strokeDasharray: "4,4" },
          }}
        />

        <VictoryAxis offsetY={40} />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    textAlign: "center",
  },
  pickerContainer: {
    width: 205,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    // backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    justifyContent: "center",
    marginBottom: 70,
    marginStart: 20,
  },
  picker: {
    height: 50,
    width: 200,
    color: "#333",
  },
  text: {
    fontSize: 20,
    marginStart: 0,
    marginEnd: 0,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default TargetReportScreen;
