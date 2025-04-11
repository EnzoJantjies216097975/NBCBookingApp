import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { signUp } from '../../api/auth';
import { UserRole } from '../../types';
import { isValidEmail, validatePasswordStrength } from '../../utils/validationUtils';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserRole>('camera_operator');
  
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.hasMinLength) {
        setPasswordError('Password must be at least 8 characters long');
        isValid = false;
      } else if (!passwordValidation.hasUppercase || !passwordValidation.hasLowercase) {
        setPasswordError('Password must include both uppercase and lowercase letters');
        isValid = false;
      } else if (!passwordValidation.hasNumber) {
        setPasswordError('Password must include at least one number');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phoneNumber: phoneNumber.trim()
      });
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created. You can now sign in.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use';
      }
      
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            editable={!loading}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            editable={!loading}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            editable={!loading}
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue as UserRole)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Camera Operator" value="camera_operator" />
              <Picker.Item label="Sound Operator" value="sound_operator" />
              <Picker.Item label="Lighting Operator" value="lighting_operator" />
              <Picker.Item label="EVS Operator" value="evs_operator" />
              <Picker.Item label="Director" value="director" />
              <Picker.Item label="Stream Operator" value="stream_operator" />
              <Picker.Item label="Technician" value="technician" />
              <Picker.Item label="Electrician" value="electrician" />
              <Picker.Item label="Producer" value="producer" />
              <Picker.Item label="Booking Officer" value="booking_officer" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 14,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  registerButton: {
    flex: 2,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});