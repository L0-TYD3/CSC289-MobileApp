import AddAddressForm from '@/features/addresses/components/AddAddressForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function AddAddressScreen() {
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const router = useRouter();

  return (
    <View className='flex-1 px-4 py-10 bg-background'>
      <AddAddressForm
        customerId={Number(customerId)}
        onSuccess={() => router.back()}
      />
    </View>
  );
}
