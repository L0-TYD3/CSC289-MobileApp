import { Text } from '@/components/ui/text';
import { useRemoveCartItem } from '@/features/cart/hooks/useRemoveCartItem';
import { useUpdateCartItem } from '@/features/cart/hooks/useUpdateCartItem';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { Pressable, View } from 'react-native';
import { CartItem } from '../types';

interface Props {
  cartItem: CartItem;
  cartId?: number;
}

export function QuantityAdjustor({ cartItem, cartId }: Props) {
  const { data: product } = useProductDetails(cartItem.product.productId);
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const editQuantity = (delta: number) => {
    if (!product) return; // Product not loaded yet
    if (cartId == null) {
      console.error('Missing cartId for quantity update');
      return;
    }

    const inventory = product.inventory.find((inv) => inv.inventoryId === cartItem.inventoryId);
    if (!inventory) {
      console.error('Inventory not found for cart item');
      return;
    }

    const stock = inventory.quantity;
    const newQuantity = Math.max(0, Math.min(cartItem.quantity + delta, stock));

    if (newQuantity === 0) {
      // Remove item from cart
      removeCartItem.mutate({
        cartId,
        dto: { inventoryId: cartItem.inventoryId, quantity: cartItem.quantity },
      });
    } else {
      // Update quantity
      updateCartItem.mutate({
        cartId,
        original: cartItem,
        dto: { inventoryId: cartItem.inventoryId, quantity: newQuantity },
      });
    }
  };

  return (
    <View className='flex-row items-center justify-center h-10 rounded-full bg-slate-200 px-3 gap-5'>
      <Pressable
        className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
        onPress={() => editQuantity(-1)}
      >
        <Text className='text-lg font-bold text-white'>-</Text>
      </Pressable>
      <Text>{cartItem.quantity}</Text>
      <Pressable
        className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
        onPress={() => editQuantity(1)}
      >
        <Text className='text-lg font-bold text-white'>+</Text>
      </Pressable>
    </View>
  );
}
