import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const Lancamentos = () => {
    const navigation = useNavigation(); // Hook para controle de navegação entre telas

    // Estados para armazenar a data inicial e final do filtro
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1))); // Começa no primeiro dia do mês atual
    const [endDate, setEndDate] = useState(new Date()); // Define como data final a data de hoje

    // Estados para controlar a exibição dos seletores de data
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Estado para alternar entre mostrar ou esconder itens registrados
    const [showRegistered, setShowRegistered] = useState(false);

    // Estados para armazenar e filtrar a lista de dados completa
    const [fullData, setFullData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const flatListRef = useRef(null); // Referência para a FlatList, para rolar até o final

    // Função para formatar a data em formato dia-mês-ano
    const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}-${mes}-${ano}`;
    };

    // useEffect para preencher a lista com todos os dias do ano atual
    useEffect(() => {
        const preencherDiasDoAno = () => {
            const anoAtual = new Date().getFullYear();
            const lista = [];

            // Gera cada dia de cada mês e armazena no formato específico
            for (let mes = 0; mes < 12; mes++) {
                const diasNoMes = new Date(anoAtual, mes + 1, 0).getDate();
                for (let dia = 1; dia <= diasNoMes; dia++) {
                    const dataFormatada = formatarData(new Date(anoAtual, mes, dia));
                    lista.push({ id: dataFormatada, data: dataFormatada, registrado: false });
                }
            }

            setFullData(lista); // Define a lista completa
            setFilteredData(lista); // Inicialmente, a lista filtrada é igual à lista completa
        };
        preencherDiasDoAno();
    }, []);

    // Função para filtrar a lista com base nas datas selecionadas
    const filtrarPorIntervaloDeDatas = () => {
        if (!startDate || !endDate) return;

        // Verifica se a data inicial é anterior à final; caso contrário, exibe um alerta
        if (startDate > endDate) {
            Alert.alert('Erro', 'A data inicial não pode ser posterior à data final.');
            return;
        }

        // Cria novas instâncias para as datas para evitar modificação direta
        const dataInicial = new Date(startDate);
        const dataFinal = new Date(endDate);

        // Define horas para abranger o intervalo completo
        dataInicial.setHours(0, 0, 0, 0);
        dataFinal.setHours(23, 59, 59, 999);

        // Filtra os itens da lista completa que estão dentro do intervalo
        const filtrados = fullData.filter(item => {
            const [dia, mes, ano] = item.data.split('-');
            const dataAtual = new Date(`${ano}-${mes}-${dia}`);
            return dataAtual >= dataInicial && dataAtual <= dataFinal;
        });

        setFilteredData(filtrados); // Atualiza a lista filtrada

        if (filtrados.length === 0) {
            Alert.alert('Aviso', 'Nenhum item encontrado para este intervalo de datas.');
        }
    };

    return (
        <View style={styles.container}>
            {/* <View style={styles.headerContainer}>
                <Text style={styles.header}>RESULTADOS</Text>
                <Image
                    source={require('../../assets/correios-logo.png')}
                    style={styles.logo}
                />
            </View> */}

            {/* Seção de filtro de datas */}
            <View style={styles.filterSection}>
                <Text>De:</Text>
                <Button title="Selecionar Data Início" onPress={() => setShowStartDatePicker(true)}  />
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
                <Button title="Selecionar Data Fim" onPress={() => setShowEndDatePicker(true)} />
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
                    <TouchableOpacity onPress={() => setShowRegistered(!showRegistered)} style={styles.checkbox}>
                        <Text style={styles.checkboxText}>{showRegistered ? '✔' : ''}</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Filtrar" onPress={filtrarPorIntervaloDeDatas} />
            </View>

            {/* Lista de lançamentos */}
            <FlatList
                ref={flatListRef} // Referência para rolar a lista
                data={filteredData} // Dados a serem exibidos
                keyExtractor={item => item.id} // Chave de cada item
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.data}</Text>
                        <Text>{item.registrado ? 'Lançamento Registrado' : 'Não registrado'}</Text>
                        <Button title="Registrar" onPress={() => navigation.navigate('TargetReport')} color="red" />
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
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
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
        borderColor:'#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    checkboxText: {
        color: '#008CBA',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default Lancamentos;












