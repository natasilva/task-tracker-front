import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Lancamentos = () => {
    const [encomendas, setEncomendas] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showRegistered, setShowRegistered] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    // Função para formatar a data
    const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}-${mes}-${ano}`; // Formato DD-MM-AAAA
    };

    // Função para obter o número de dias no mês
    const obterDiasNoMes = (mes, ano) => new Date(ano, mes, 0).getDate();

    // Preencher lista com os dias do mês
    useEffect(() => {
        const preencherDiasDoMes = () => {
            const dataAtual = new Date();
            const mes = dataAtual.getMonth() + 1;
            const ano = dataAtual.getFullYear();
            const diasNoMes = obterDiasNoMes(mes, ano);
            
            const lista = Array.from({ length: diasNoMes }, (_, dia) => {
                const dataFormatada = formatarData(new Date(ano, mes - 1, dia + 1));
                return { id: dataFormatada, data: dataFormatada, registrado: false };
            });

            setFilteredData(lista);
        };
        preencherDiasDoMes();
    }, []);

    // Registrar encomenda
    const registrarEncomenda = (dataFormatada) => {
        const [dia, mes, ano] = dataFormatada.split('-');
        const mesAno = `${mes}/${ano}`;
        setEncomendas(prev => ({
            ...prev,
            [mesAno]: [...(prev[mesAno] || []), { dataFormatada }]
        }));
    };

    // Filtrar encomendas por data
    const filtrarPorIntervaloDeDatas = () => {
        if (!startDate || !endDate) return;

        const [startDia, startMes, startAno] = startDate.split('-');
        const [endDia, endMes, endAno] = endDate.split('-');
        const dataInicial = new Date(`${startAno}-${startMes}-${startDia}`);
        const dataFinal = new Date(`${endAno}-${endMes}-${endDia}`);

        const filtrados = filteredData.filter(item => {
            const [dia, mes, ano] = item.data.split('-');
            const dataAtual = new Date(`${dia}-${mes}-${ano}`);
            const registrado = encomendas[`${mes}/${ano}`];
            return dataAtual >= dataInicial && dataAtual <= dataFinal && (!showRegistered || registrado);
        });

        setFilteredData(filtrados);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Resultados</Text>

            <View style={styles.filterSection}>
                <Text>De:</Text>
                <TextInput
                    style={styles.input}
                    value={startDate}
                    placeholder="DD-MM-AAAA"
                    onChangeText={setStartDate}
                />
                <Text>Até:</Text>
                <TextInput
                    style={styles.input}
                    value={endDate}
                    placeholder="DD-MM-AAAA"
                    onChangeText={setEndDate}
                />
                <View style={styles.checkboxContainer}>
                    <Text>Somente Registrados:</Text>
                    <TouchableOpacity onPress={() => setShowRegistered(!showRegistered)}>
                        <Text>{showRegistered ? '✔' : ' '}</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Filtrar" onPress={filtrarPorIntervaloDeDatas} />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.data}</Text>
                        <Text>{item.registrado ? 'Lançamento Registrado' : 'Não registrado'}</Text>
                        {!item.registrado && (
                            <Button title="Registrar" onPress={() => registrarEncomenda(item.data)} />
                        )}
                    </View>
                )}
            />

            <Button title="Rolar até o final" onPress={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ebe9e9',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        color: '#008CBA',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filterSection: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 5,
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: '#008CBA',
        padding: 8,
        marginVertical: 10,
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Lancamentos;


