import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const Lancamentos = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 10))
  );
  const [endDate, setEndDate] = useState(new Date());

  const [showRegistered, setShowRegistered] = useState(false);

  const flatListRef = useRef(null);

  const formatDate = (date) => {
    const value = new Date(date);
    return value.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const API_URL = process.env.API_URL;
    const listResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/results/`, {
          params: {
            registered: showRegistered,
            endDate: endDate.toISOString().split("T")[0],
            initialDate: startDate.toISOString().split("T")[0],
          },
        });
        setResults(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    listResults();
  }, [startDate, endDate, showRegistered]);

  const navigation = useNavigation();

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.label}>De:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(startDate) || "Selecionar Data Início"}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(new Date(selectedDate.setHours(0, 0, 0, 0)));
              }
            }}
          />
        )}

        <Text style={styles.label}>Até:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(endDate) || "Selecionar Data Fim"}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(new Date(selectedDate.setHours(0, 0, 0, 0)));
              }
            }}
          />
        )}

        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>Somente Registrados:</Text>
          <TouchableOpacity
            onPress={() => setShowRegistered(!showRegistered)}
            style={styles.checkbox}
          >
            <Text style={styles.checkboxText}>{showRegistered ? "✔" : ""}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.validation_date ? formatDate(item.validation_date) : ''}</Text>
            <Text>{item.id ? "Registrado" : "Não registrado"}</Text>
            <TouchableOpacity
              style={item.id ? styles.editButton : styles.registerButton}
              onPress={() => {
                const n_data = new Date(item.validation_date);
                return navigation.navigate("Register", {
                  date: n_data,
                  id_result: item.id || null,
                });
              }}
            >
              <Text style={styles.actionButtonText}>
                {item.id ? "Editar" : "Registrar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.scrollButton}
        onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.scrollButtonText}>Rolar até o final</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  dateButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: "#007BFF",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  
  editButton: {
    backgroundColor: "#FFC107", // Cor para o botão de Editar (exemplo: Amarelo)
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  
  registerButton: {
    backgroundColor: "#28A745", // Cor para o botão de Registrar (exemplo: Verde)
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  scrollButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  scrollButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Lancamentos;
