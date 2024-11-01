import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useRoute } from '@react-navigation/native';

const TotalizersScreen = () => {
  const [services, setServices] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  
  const formatDate = (date) => {
    const value = new Date(date)
    return value.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  
  const route = useRoute();
  const {date} = route.params;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = process.env.API_URL;
        const response = await axios.get(`${API_URL}/services/`)

        setServices(response.data);

        // Inicializa os valores do formulário
        const initialFormValues = response.data.reduce((acc, service) => {
          acc[service.id] = ""; // Inicia cada campo como vazio
          return acc;
        }, {});
        setFormValues(initialFormValues);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (id, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const items = Object.keys(formValues).map(id_service => ({
      id_service,
      quantity: parseInt(formValues[id_service]) || 0,
    }));

    const API_URL = process.env.API_URL;
    axios.post(`${API_URL}/results/`, { id_user : 1, validation_date: new Date(date), items })
      .then(response => {
          console.log('Dados enviados com sucesso:', response.data);
      })
      .catch(error => {
          console.error('Erro ao enviar dados:', error);
      });
  };

  return (
    <ScrollView>
      <View style={ styles.container }>
        <Text>Data: {formatDate(date)}</Text>
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
