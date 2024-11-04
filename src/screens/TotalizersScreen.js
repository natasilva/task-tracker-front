import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const TotalizersScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [result, setResult] = useState([]);
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

        const servicesData = servicesResponse.data;
        setServices(servicesData);

        if (!id_result) {
          const initialFormValues = servicesData.reduce((acc, service) => {
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
      id: formValues[id_service].id,
      quantity: parseInt(formValues[id_service]) || 0,
    }));

    try {
      const response = id_result ? axios.patch(`${API_URL}/results/${id_result}`, {
        items,
      }) : axios.post(`${API_URL}/results/`, {
        id_user: 1,
        validation_date: new Date(date),
        items,
      });

      navigation.replace("Results");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar dados.</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>Data: {formatDate(date)}</Text>
        {services.map((service) => (
          <View key={service.id} style={{ marginBottom: 20 }}>
            <Text>{service.name}</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 8,
              }}
              keyboardType="numeric"
              placeholder={`Quantidade de ${service.name}`}
              value={formValues[service.id]}
              onChangeText={(value) => handleInputChange(service.id, value)}
            />
          </View>
        ))}
        <Button title="Salvar" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 20,
  },
  body: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default TotalizersScreen;
