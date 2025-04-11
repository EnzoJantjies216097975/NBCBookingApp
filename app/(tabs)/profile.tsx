import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../../contexts/AuthContext';
import { signOut } from '../../api/auth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen() {
  const { userProfile } = useContext(AuthContext);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }
        }
      ]
    );
  };

  if (!userProfile) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>User not logged in</ThemedText>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <ThemedText style={styles.buttonText}>Go to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const formatRoleName = (role: string): string => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {userProfile.profilePicture ? (
            <Image source={{ uri: userProfile.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Icon name="person" size={60} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>{formatRoleName(userProfile.role)}</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Icon name="person" size={20} color="#007bff" />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{userProfile.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="email" size={20} color="#007bff" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userProfile.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="phone" size={20} color="#007bff" />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {userProfile.phoneNumber || 'Not provided'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon name="work" size={20} color="#007bff" />
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{formatRoleName(userProfile.role)}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/screens/common/ProfileScreen')}
          >
            <Icon name="edit" size={18} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: '#dc3545' }]}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={18} color="#fff" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 24,
    alignItems: 'center',
    paddingTop: 60,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  roleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileInfo: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
    marginLeft: 10,
    color: '#555',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  profileButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#dc3545',
  }
});