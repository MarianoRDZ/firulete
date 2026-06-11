import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } from '@/services/auth';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function clearError() {
    if (error) setError('');
  }

  async function handleEmailSubmit() {
    if (!email || !password) {
      setError('Completá todos los campos');
      return;
    }
    if (mode === 'register' && !name) {
      setError('Ingresá tu nombre');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
        Alert.alert('¡Listo!', 'Revisá tu email para confirmar tu cuenta.');
      }
    } catch (e: any) {
      setError(e.message ?? 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message ?? 'Error al iniciar con Google');
    } finally {
      setLoading(false);
    }
  }

  async function handleApple() {
    setLoading(true);
    setError('');
    try {
      await signInWithApple();
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setError(e.message ?? 'Error al iniciar con Apple');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center pt-20 pb-10 px-6">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-4">
            <Text className="text-4xl">🐾</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">Huellas</Text>
          <Text className="text-base text-gray-500 mt-2 text-center">
            Encontrá, reportá y adoptá mascotas cerca tuyo
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 pb-10">
          {/* Social buttons */}
          <TouchableOpacity
            onPress={handleGoogle}
            disabled={loading}
            className="flex-row items-center justify-center border border-gray-200 rounded-xl py-3.5 mb-3 bg-white"
          >
            <Text className="text-lg mr-2">G</Text>
            <Text className="text-base font-medium text-gray-700">Continuar con Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={{ width: '100%', height: 48, marginBottom: 12 }}
              onPress={handleApple}
            />
          )}

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-3 text-sm text-gray-400">o ingresá con email</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Mode toggle */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-5">
            <TouchableOpacity
              onPress={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg items-center ${mode === 'login' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`text-sm font-medium ${mode === 'login' ? 'text-gray-900' : 'text-gray-500'}`}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg items-center ${mode === 'register' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`text-sm font-medium ${mode === 'register' ? 'text-gray-900' : 'text-gray-500'}`}>
                Registrarme
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name field (register only) */}
          {mode === 'register' && (
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 mb-3"
              placeholder="Nombre"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={(v) => { setName(v); clearError(); }}
              autoCapitalize="words"
              autoComplete="name"
            />
          )}

          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 mb-3"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={(v) => { setEmail(v); clearError(); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 mb-1"
            placeholder="Contraseña"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={(v) => { setPassword(v); clearError(); }}
            secureTextEntry
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />

          {/* Error */}
          {error ? (
            <Text className="text-red-500 text-sm mt-2 mb-1">{error}</Text>
          ) : (
            <View className="h-6" />
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleEmailSubmit}
            disabled={loading}
            className="bg-primary rounded-xl py-4 items-center mt-1"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
