import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AdoptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Adopción {id}</Text>
    </View>
  );
}
