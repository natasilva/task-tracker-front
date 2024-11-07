import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
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
        const response = await axios.get(`${API_URL}/users/`);
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    listUsers();
  }, []);

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
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    {/* <View style={styles.container}> */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={showStartPicker} style={styles.input}>
            <Text style={styles.inputText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={showEndPicker} style={styles.input}>
            <Text style={styles.inputText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={id_user}
          style={styles.picker}
          onValueChange={(id) => setUser(id)}
        >
          {users.map((user) => (
            <Picker.Item key={user.id} label={user.name} value={user.id} />
          ))}
        </Picker>
      </View>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={handleConfirmStart}
        onCancel={hideStartPicker}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={handleConfirmEnd}
        onCancel={hideEndPicker}
      />

      <Text style={styles.chartTitle}>Percentual atingido x Meta</Text>
      <VictoryChart
        domainPadding={{ x: 50, y: 50 }}  
        padding={{ top: 10, bottom: 15, left: 60, right: 30 }}
      >
        <VictoryGroup offset={15} colorScale={"qualitative"} horizontal barRatio={0.8}>
          <VictoryBar
            data={data}
            x="name"
            y="targetvalue"
            barWidth={15}
            style={{ data: { fill: "#e74c3c" } }}
          />
          <VictoryBar
            data={data}
            x="name"
            y="achievedvalue"
            barWidth={15}
            style={{ data: { fill: "#3498db" } }}
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

      {
        data.map((item) => (
          <Text style={styles.listItem}>
            <Text style={styles.boldText}>{item.name}</Text> - {item.description}
          </Text>
        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
    backgroundColor: "#ffffff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  flatList: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default TargetReportScreen;
