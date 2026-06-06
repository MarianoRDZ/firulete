import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="report/lost" />
      <Stack.Screen name="report/found" />
      <Stack.Screen name="pet/[id]" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="business/[id]" />
      <Stack.Screen name="adoption/[id]" />
    </Stack>
  );
}
