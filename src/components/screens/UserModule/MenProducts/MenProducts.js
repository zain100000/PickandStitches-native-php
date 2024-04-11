import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
  Text,
} from 'react-native';
import axios from 'axios';
import GentsItemsContainer from '../../../othercomponents/GentsProducts/GentsItemContainer';

const MenProducts = () => {
  const [gentsProducts, setGentsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    axios
      .get(
        'https://pickandstitches.com/font-awesome/scss/scss/api_get_male_products.php',
      )
      .then(response => {
        console.log('Response data:', response.data);
        const gentsProducts = response.data.filter(
          product => product.type === 'male',
        );
        setGentsProducts(gentsProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const timestamp = new Date().getTime(); // Generate a unique timestamp
      const response = await axios.get(
        `https://pickandstitches.com/font-awesome/scss/scss/api_get_male_products.php?timestamp=${timestamp}`,
      );
      const gentsProducts = response.data.filter(
        product => product.type === 'male',
      );
      setGentsProducts(gentsProducts);
    } catch (error) {
      console.error('Error fetching new data:', error);
    }

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : gentsProducts.length > 0 ? (
        <FlatList
          data={gentsProducts}
          keyExtractor={item => item.id.toString()} // Use index as the key
          renderItem={({item}) => (
            <GentsItemsContainer
              product_pic={item.pic} // Use item.pic for product pic
              product={item.name} // Use item.name for product name
              price={item.price} // Use item.price for product price
              onwards={'Onwards'}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-xl" style={{fontFamily: 'Montserrat-SemiBold'}}>
            No Gents Products
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MenProducts;
