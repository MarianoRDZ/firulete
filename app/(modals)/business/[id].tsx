import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Negocio {id}</Text>
    </View>
  );
}
