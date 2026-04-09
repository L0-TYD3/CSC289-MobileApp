import { DataWrapper } from "@/components/DataWrapper";
import { Text } from "@/components/ui/text";
import { Button, FlatList, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from "../hooks/useCart";
import { CartItem } from "../types";
import { CartCard } from "./CartCard";
import NoCartItemsAvailable from "./NoCartItemsAvailable";

export default function CartOverviewScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useCart();
  const totalPrice = data?.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) ?? 0;

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='flex-1'>
        <DataWrapper
          data={data?.items}
          isLoading={isLoading}
          error={error}
          noDataComponent={<NoCartItemsAvailable />}
        >
          {(cartItems: CartItem[]) => (
            <FlatList
                data={cartItems}
                keyExtractor={(item) => String(item.product.productId)}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) =>
                  data?.cartId ? <CartCard cartItem={item} cartId={data.cartId} /> : null
                }
                refreshing={isRefetching}
                onRefresh={refetch}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className='mb-1'>
                    <Text className="text-2xl font-bold text-foreground">
                      Items
                    </Text>
                  </View>
                }
                ListEmptyComponent={<NoCartItemsAvailable />}
            />
          )}
        </DataWrapper>
      </View>

      {/* Checkout button */}
      <CheckoutButton
        cartItems={data?.items}
        totalPrice={totalPrice}
      />
    </SafeAreaView>
  );
}

function CheckoutButton({
  cartItems,
  totalPrice,
  button,
} : {
  cartItems?: CartItem[];
  totalPrice: number;
  button?: React.ReactNode;
}) {
  return (
    <View className='p-4 border-t bg-background'>
      <View className='flex-2 items-center justify-between mb-4'>
        <Text className='text-lg font-medium text-foreground'>Subtotal</Text>
        <Text className='text-lg font-bold text-foreground'>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)}
        </Text>
        {button ?? (
          <Button 
            disabled={!cartItems || cartItems.length === 0}
            onPress={() => {
              // Placeholder for checkout action
              alert('Checkout functionality coming soon!');
            }}
            title="Checkout button goes here (placeholder)"
          />
        )}
      </View>
    </View>
  );
}