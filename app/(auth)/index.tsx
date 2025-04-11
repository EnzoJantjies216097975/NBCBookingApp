import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
    const router = useRouter(); 
    useEffect(() => {
      const timeout = setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
  
      return () => clearTimeout(timeout);
    }, []);
  
    return <View style={styles.container} />;
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
  });