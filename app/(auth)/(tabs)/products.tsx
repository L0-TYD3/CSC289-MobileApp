import { useCart } from '@/features/cart/hooks/useCart';
import ProductsListScreen from '@/features/products/components/ProductsListScreen';

export default function AuthProductsScreen() {
  const { data: cart } = useCart();

  console.log(JSON.stringify(cart, null, 2));
  return <ProductsListScreen />;
}
