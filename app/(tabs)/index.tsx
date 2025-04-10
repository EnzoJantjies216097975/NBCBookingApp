import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../../contexts/AuthContext';
import { RoleContext } from '../../contexts/RoleContext';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  const { userProfile, loading } = useContext(AuthContext);
  const { activeRole, setActiveRole } = useContext(RoleContext);

  // If user is authenticated, redirect to appropriate dashboard based on role
  useEffect(() => {
    if (!loading && userProfile && activeRole) {
      if (activeRole === 'booking_officer') {
        router.replace('../../../');
      } else if (activeRole === 'producer') {
        router.replace('../../screens/producer/ProducerDashboard');
      } else {
        router.replace('../../screens/operator/OperatorDashboard');
      }
    }
  }, [userProfile, loading, activeRole]);

  const handleLogin = () => {
    router.push('../../screens/auth/LoginScreen');
  };

  const handleRegister = () => {
    router.push('../../screens/auth/RegisterScreen');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">TV Production Booking</ThemedText>
        <HelloWave />
      </View>

      <ThemedView style={styles.content}>
        <ThemedText style={styles.subtitle}>
          Streamline your production scheduling and staff management
        </ThemedText>

        {!userProfile ? (
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Icon name="login" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Icon name="person-add" size={20} color="#fff" />
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ThemedText>Loading your dashboard...</ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
    gap: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  authButtons: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  registerButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
  },
});