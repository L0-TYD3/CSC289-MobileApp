import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { CartItem } from '../types';
import { QuantityAdjustor } from './QuantityAdjustor';

interface Props {
  cartItem: CartItem;
  cartId: number;
  itemCount?: number;
}

export function CartCard({ cartItem, cartId, itemCount }: Props) {
  const lineTotal = cartItem.unitPrice * cartItem.quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  }).format(lineTotal);

  return (
    <Link
      href={`/products/${cartItem.product.productId}`}
      push
      asChild
    >
      <Pressable className='flex-1' android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
        {({ pressed }) => (
          <Card className={cn('flex-row gap-0 overflow-hidden items-center py-0', pressed && 'opacity-80')}>
            {/* Image */}
            <Image
              source={{ uri: cartItem.product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL}}
              className='w-40 h-40 bg-muted'
              resizeMode='cover'
            />

            {/* Content */}
            <View className='flex-1 justify-end items-end p-3 gap-5'>
              {/* Name */}
              <Text className='font-semibold text-lg leading-snug' numberOfLines={2}>
                {cartItem.product.productName}
              </Text>

              {/* Quantity adjustor */}
              <QuantityAdjustor cartItem={cartItem} cartId={cartId} />
              
              {/* Price */}
              <Text className='text-muted-foreground text-lg'>
                  {formattedPrice}
                  {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              </Text>
            </View>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}

