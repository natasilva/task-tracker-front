import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const TotalizersScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    const value = new Date(date);
    return value.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const route = useRoute();
  const { date, id_result } = route.params;
  const API_URL = process.env.API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesResponse, resultResponse] = await Promise.all([
          axios.get(`${API_URL}/services/`),
          id_result ? axios.get(`${API_URL}/results/${id_result}`) : Promise.resolve(null),
        ]);

        setServices(servicesResponse.data);

        if (!id_result) {
          const initialFormValues = servicesResponse.data.reduce((acc, service) => {
            acc[service.id] = "";
            return acc;
          }, {});
          setFormValues(initialFormValues);
        }

        if (id_result && resultResponse) {
          const resultData = resultResponse.data.items.reduce((acc, item) => {
            acc[item.service.id] = item.quantity.toString();
            return acc;
          }, {});
          setFormValues(resultData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_result]);

  const handleInputChange = (id, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const items = Object.keys(formValues).map((id_service) => ({
      id_service,
      quantity: parseInt(formValues[id_service]) || 0,
    }));

    try {
      const response = id_result
        ? await axios.patch(`${API_URL}/results/${id_result}`, { items })
        : await axios.post(`${API_URL}/results/`, {
            id_user: 1,
            validation_date: new Date(date),
            items,
          });

      navigation.replace("Results");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Erro ao carregar dados.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.dateText}>Data: {formatDate(date)}</Text>
      {services.map((service) => (
        <View key={service.id} style={styles.serviceContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={`Quantidade de ${service.name}`}
            value={formValues[service.id]}
            onChangeText={(value) => handleInputChange(service.id, value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  dateText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceContainer: {
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#007BFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#F8F9FA",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
});

export default TotalizersScreen;
