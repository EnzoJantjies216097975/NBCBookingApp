import { Stack } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter, useSegments } from 'expo-router';

export default function AuthLayout() {
  const { currentUser, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // If we're not loading and there's a user logged in,
    // redirect to the appropriate screen based on the user's role
    if (!loading && currentUser) {
      // User is logged in, navigate to the tabs (home)
      router.replace('/(tabs)');
    }
  }, [currentUser, loading, router]);

  // If still loading, don't render anything
  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Sign In',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Create Account',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Reset Password',
          headerShown: true,
        }} 
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}