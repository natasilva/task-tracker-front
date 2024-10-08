import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar as telas
import LoginScreen from './screens/LoginScreen';
import ResultsScreen from './screens/ResultsScreen';
import TargetReportScreen from './screens/TargetReportScreen';

const Stack = createStackNavigator();

const Routes = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        {/* Rota para a tela de login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />

        {/* Rota para a listagem de resultados diários */}
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ title: 'Listagem de Resultados Diários' }} 
        />

        {/* Rota para o relatório de metas */}
        <Stack.Screen 
          name="TargetReport" 
          component={TargetReportScreen} 
          options={{ title: 'Relatório de Metas' }} 
        />
      </Stack.Navigator>
  );
};

export default Routes;
