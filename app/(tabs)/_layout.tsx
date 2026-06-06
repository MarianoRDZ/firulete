import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="report" options={{ title: 'Reportar' }} />
      <Tabs.Screen name="adoptions" options={{ title: 'Adopciones' }} />
      <Tabs.Screen name="directory" options={{ title: 'Directorio' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
