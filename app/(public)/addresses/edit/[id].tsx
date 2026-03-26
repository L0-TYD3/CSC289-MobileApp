import { Text } from '@/components/ui/text';
import UpdateAddressForm from '@/features/addresses/components/UpdateAddressForm';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function EditAddressScreen() {
  const { id, customerId } = useLocalSearchParams<{ id: string; customerId: string }>();
  const router = useRouter();
  const { data: addresses, isLoading } = useGetCurrentCustomerAddresses(Number(customerId));

  const address = addresses?.find((a) => a.id === Number(id));

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!address) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-muted-foreground'>Address not found.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-background px-4 py-10'>
      <UpdateAddressForm
        address={address}
        onSuccess={() => router.back()}
      />
    </View>
  );
}
