import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const BudgetFormScreen = ({ navigation, route }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [nameBudget, setNameBudget] = useState(route.params?.nameBudget || '');
  const [amount, setAmount] = useState(route.params?.amount || '');

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
  
      const headers = { Authorization: `Bearer ${token}` };
      const budgetData = { nameBudget, amount, ...(route.params && { id: route.params.id }) };
  
      await axios.post(apiUrl + '/v1/budgets', budgetData, { headers });
  
      Alert.alert('Success', `Budget ${route.params ? 'updated' : 'added'} successfully`);
      navigation.navigate('BudgetList');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{route.params ? 'Update Budget' : 'Add New Budget'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Budget Name"
        value={nameBudget}
        onChangeText={setNameBudget}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
        maxLength={12}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{route.params ? 'Update Budget' : 'Add Budget'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#00ca80',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#00ca80',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BudgetFormScreen;
