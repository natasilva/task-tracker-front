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

  const flatListRef = useRef(null); // Referência para a FlatList, para rolar até o final

  const formatDate = (date) => {
    const value = new Date(date)
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
        console.log(results)
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    listResults();
  }, [startDate, endDate, showRegistered]);

  const navigation = useNavigation();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text>De:</Text>
        <Button
          title="Selecionar Data Início"
          onPress={() => setShowStartDatePicker(true)}
        />
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(new Date(selectedDate.setHours(0, 0, 0, 0))); // Zera as horas
              }
            }}
          />
        )}

        <Text>Até:</Text>
        <Button
          title="Selecionar Data Fim"
          onPress={() => setShowEndDatePicker(true)}
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(new Date(selectedDate.setHours(0, 0, 0, 0))); // Zera as horas
              }
            }}
          />
        )}

        {/* Filtro para mostrar apenas registros marcados */}
        <View style={styles.checkboxContainer}>
          <Text>Somente Registrados:</Text>
          <TouchableOpacity
            onPress={() => setShowRegistered(!showRegistered)}
            style={styles.checkbox}
          >
            <Text style={styles.checkboxText}>{showRegistered ? "✔" : ""}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de lançamentos */}
      <FlatList
        ref={flatListRef} // Referência para rolar a lista
        data={results}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.validation_date ? formatDate(item.validation_date) : ''}</Text>
            <Text>{item.id ? "Lançamento Registrado" : "Não registrado"}</Text>
            <Button
              title={item.id ? "Editar" : "Registrar"}
              color="red"
              onPress={() => {
                const n_data = new Date(item.validation_date)
                return navigation.navigate("Register", {
                  date: n_data,
                })
              }}
            />
          </View>
        )}
      />

      {/* Botão para rolar até o final da lista */}
      <Button
        title="Rolar até o final"
        onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
    </View>
  );
};

// Estilos para layout e apresentação
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 10,
  },
  logo: {
    width: 90,
    height: 60,
    marginRight: 5,
    marginTop: -30,
    left: 20,
  },
  filterSection: {
    marginTop: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  checkboxText: {
    color: "#008CBA",
    fontSize: 14,
    fontWeight: "bold",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Lancamentos;
