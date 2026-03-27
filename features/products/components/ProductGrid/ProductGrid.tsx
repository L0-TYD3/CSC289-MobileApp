import { DataWrapper } from '@/components/DataWrapper';
import { SearchBar } from '@/components/SearchBar';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import NoProductsAvailable from '../NoProductsAvailable';
import { ProductCard } from '../ProductCard';

export function ProductGrid() {
  const { data, isLoading, error } = useProducts();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;
  const [query, setQuery] = useState('');

  const filteredProducts = data?.filter((p) =>
    p.productName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DataWrapper
      data={data}
      isLoading={isLoading}
      error={error}
      noDataComponent={<NoProductsAvailable />}
    >
      {() => (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.productId)}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className='mb-1'>
              <SearchBar
                value={query}
                onSearch={setQuery}
                placeholder='Search products...'
              />
            </View>
          }
          ListEmptyComponent={<NoProductsAvailable />}
        />
      )}
    </DataWrapper>
  );
}
