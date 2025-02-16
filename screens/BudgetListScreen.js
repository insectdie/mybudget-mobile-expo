import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useFocusEffect } from '@react-navigation/native';

const BudgetListScreen = ({ navigation }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL + '/v1/budgets';
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchBudgetItems();
    }, [])
  );

  const fetchBudgetItems = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true); 
    setError(null); 
    try {
      const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
      setBudgetItems(response.data);
    } catch (error) {
      setError('Error fetching budget items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteBudgetItem = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Success', 'Item deleted successfully');
      fetchBudgetItems();
    } catch (error) {
      console.error('Error deleting budget item:', error);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: () => deleteBudgetItem(id) },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ca80" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchBudgetItems} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (budgetItems.length === 0) {
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

        <View style={styles.centered}>
          <Text>No budget items found</Text>
        </View>
      </View>
    );
  }

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

      <FlatList
        data={budgetItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemLabel}>Name of Budget:</Text>
              <Text style={styles.itemValue}>{item.nameBudget}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemLabel}>Amount:</Text>
              <Text style={styles.itemValue}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BudgetForm', { id: item.id, nameBudget: item.nameBudget, amount: item.amount })}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => confirmDelete(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
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
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  itemValue: {
    fontSize: 16,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00ca80',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff6f61',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#00ca80',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BudgetListScreen;
