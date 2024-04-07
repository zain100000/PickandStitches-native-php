import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import Print from 'react-native-print';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const GentsCheckOut = () => {
  const route = useRoute();
  const product = route.params?.product || 'Default product';
  const product_pic = route.params?.product_pic || 'Default product';
  const price = parseFloat(route.params?.price);
  const name = route.params?.name || 'Default name';
  const email = route.params?.email || 'Default email';
  const cell = route.params?.cell || 'Default cell';
  const adress = route.params?.adress || 'Default adress';
  const neck = route.params?.neck || 'Not selected';
  const Pocket = route.params?.Pocket || 'Not selected';
  const Daman = route.params?.Daman || 'Not selected';
  const wrist = route.params?.wrist || 'Not selected';
  const comments = route.params?.comments || 'No Additional Comment';
  const puncha = route.params?.puncha || false;
  const Tob_double_stitch = route.params?.Tob_double_stitch || false;
  const Embroidery = route.params?.Embroidery || false;
  const sample = route.params?.sample;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Define pricing variables
  const basePrice = price;
  const singleKanta = 100;
  const doubleKanta = 200;
  const tob_double_stitch = 300;
  const embroideryFull = 500;
  const embroideryNormal = 300;
  const deliverycharges = 300;

  const calculateTotalPrice = () => {
    let totalPrice = basePrice;

    if (puncha === 'Single Kanta') {
      totalPrice += singleKanta;
    } else if (puncha === 'Double Kanta') {
      totalPrice += doubleKanta;
    }

    if (Tob_double_stitch === 'Tob Double Stitch') {
      totalPrice += tob_double_stitch;
    }

    if (Embroidery === 'Embroidery Full') {
      totalPrice += embroideryFull;
    } else if (Embroidery === 'Embroidery Normal') {
      totalPrice += embroideryNormal;
    }

    if (deliverycharges) {
      totalPrice += deliverycharges;
    }

    return totalPrice;
  };

  // Get the dynamically calculated total price
  const total = calculateTotalPrice();

  // Function to format the price as currency
  const formatPriceAsCurrency = amount => {
    return new Intl.NumberFormat('en-PKR', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  // Define order details for display
  const orderDetails = [
    {label: 'Product Name', value: product},
    {label: 'Name', value: name},
    {label: 'Email', value: email},
    {label: 'Mobile', value: cell},
    {label: 'Address', value: adress},
    {label: 'Neck Type', value: neck || 'Not selected'},
    {label: 'Pocket Type', value: Pocket || 'Not selected'},
    {label: 'Daman Type', value: Daman || 'Not selected'},
    {label: 'Wrist Type', value: wrist || 'Not selected'},
    {label: 'Comment', value: comments || 'No Additional Comment'},
    {label: 'Product Base Price', value: formatPriceAsCurrency(price)},
    {
      label: 'Leg Opening(Puncha)',
      value: `${puncha || 'Not selected'} (Rs.${
        puncha === 'Single Kanta'
          ? singleKanta
          : puncha === 'Double Kanta'
          ? doubleKanta
          : 0
      })`,
    },

    {
      label: 'Tob Stitch',
      value: `${Tob_double_stitch || 'Not selected'} (Rs.${
        Tob_double_stitch === 'Tob Double Stitch' ? 300 : 0
      })`,
    },

    {
      label: 'Embroidery',
      value: `${Embroidery || 'Not selected'} (Rs.${
        Embroidery === 'Embroidery Full'
          ? 500
          : Embroidery === 'Embroidery Normal'
          ? 300
          : 0
      })`,
    },

    {label: 'Delivery Charges', value: formatPriceAsCurrency(deliverycharges)},

    {
      label: 'Samples',
      value: (
        <View className="flex-1 flex-row p-5">
          {sample && sample.length > 0 ? (
            sample.map(uri => (
              <Image key={uri} source={{uri}} className="w-20 h-20" />
            ))
          ) : (
            <Text
              className="text-gray-400 text-sm"
              style={{fontFamily: 'Montserrat-SemiBold'}}>
              No Sample Attached
            </Text>
          )}
        </View>
      ),
    },
  ];

  // Function to handle printing the receipt
  const printReceipt = async () => {
    const receiptContent = getOrderReceiptContent();

    try {
      const printJob = await Print.print({
        html: receiptContent,
      });

      if (printJob) {
        console.log('Printing successful');
      } else {
        console.log('Printing canceled');
      }
    } catch (error) {
      console.error('Error printing receipt:', error);
    }
  };

  // Function to format the receipt content
  const getOrderReceiptContent = () => {
    // Implement the formatting of the receipt content here
    // You can use the order details from the state to create the receipt content

    const receiptContent = `
    <html>
      <head>
        <style>
          h1 {
            font-size: 3rem;
            text-align: center;
          }          
        </style>
      </head>
      <body>
        <h1>Order Receipt</h1>
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Product Name</h4>
        <p style="font-size:2rem">${product}</p>      
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Name</h4>
        <p style="font-size:2rem">${name}</p>      
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Email</h4>
        <p style="font-size:2rem">${email}</p>      
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Cell</h4>
        <p style="font-size:2rem">${cell}</p>      
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Address</h4>
        <p style="font-size:2rem">${adress}</p>      
        </div>        
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Neck Type</h4>
        <p style="font-size:2rem">${neck || 'Not selected'}</p>
        </div>    

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Pocket Type</h4>
        <p style="font-size:2rem">${Pocket || 'Not selected'}</p>
        </div>      

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Daman Type</h4>
        <p style="font-size:2rem">${Daman || 'Not selected'}</p>
        </div>      

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Wrist Type</h4>
        <p style="font-size:2rem">${wrist || 'Not selected'}</p>
        </div>    

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Comments</h4>
        <p style="font-size:2rem">${comments || 'No Comment'}</p>
        </div>  

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Product Base Price</h4>
        <p style="font-size:2rem">${formatPriceAsCurrency(basePrice)}</p>
        </div>    

        <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Leg Opening(Puncha)</h4>
        <p style="font-size:2rem">${puncha || 'Not selected'} (Rs.${
      puncha === 'Single Kanta' ? 100 : puncha === 'Double Kanta' ? 200 : 0
    })</p>
        </div>      

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Tob Double Stitch</h4>
        <p style="font-size:2rem">${Tob_double_stitch || 'Not selected'} (Rs.${
      Tob_double_stitch === 'Tob Double Stitch' ? 300 : 0
    })</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Embroidery</h4>
        <p style="font-size:2rem">${Embroidery || 'Not selected'} (Rs.${
      Embroidery === 'Embroidery Full'
        ? 500
        : Embroidery === 'Embroidery Normal'
        ? 300
        : 0
    })</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Delivery Charges</h4>
        <p style="font-size:2rem">${formatPriceAsCurrency(deliverycharges)}</p>
      </div>      

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size:2rem">Total Price</h4>
        <p style="font-size:2rem">${formatPriceAsCurrency(total)}</p>
      </div>            
      </body>
    </html>
  `;

    return receiptContent;
  };

  const handleCheckOut = async () => {
    try {
      // Show loading indicator
      setLoading(true);

      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString();
      ('');

      const formData = new FormData();

      // Define the order data
      const orderData = {
        name,
        email,
        cell,
        adress,
        neck,
        Pocket,
        Daman,
        wrist,
        comments,
        price,
        puncha: puncha
          ? `${puncha} (Rs.${
              puncha === 'Single Kanta'
                ? 100
                : puncha === 'Double Kanta'
                ? 200
                : 0
            })`
          : '',

        Tob_double_stitch: Tob_double_stitch ? 'Tob Double Stitch(Rs.300)' : '',
        Embroidery: Embroidery
          ? `${Embroidery} (Rs.${
              Embroidery === 'Embroidery Full'
                ? 500
                : Embroidery === 'Embroidery Normal'
                ? 300
                : 0
            })`
          : '',
        type: 'male',
        total: calculateTotalPrice(),
        date: currentDate,
        time: currentTime,
        deliverycharges,
        product,
        product_pic,

        sample: sample.forEach((uri, index) => {
          const sample = `sample_${index + 1}.jpg`;
          formData.append('sample[]', {
            uri: uri,
            type: 'image/jpeg',
            name: sample,
          });
        }),
      };

      // Send order details to the backend API
      const orderApiUrl =
        'https://pickandstitches.com/font-awesome/scss/scss/api_male_orders.php';
      const response = await axios.post(orderApiUrl, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Order submission successful
        // Now, send a notification to the admin
        const notificationApiUrl =
          'https://pickandstitches.com/font-awesome/scss/scss/api_male_orders_notifications.php';
        const notificationResponse = await axios.post(notificationApiUrl, {
          name,
          email,
          cell,
          adress,
          neck,
          Pocket,
          Daman,
          wrist,
          comments,
          product,
          price,
          puncha: puncha
            ? `${puncha} (Rs.${
                puncha === 'Single Kanta'
                  ? 100
                  : puncha === 'Double Kanta'
                  ? 200
                  : 0
              })`
            : '',
          Tob_double_stitch: Tob_double_stitch
            ? 'Tob Double Stitch(Rs.300)'
            : '',
          Embroidery: Embroidery
            ? `${Embroidery} (Rs.${
                Embroidery === 'Embroidery Full'
                  ? 500
                  : Embroidery === 'Embroidery Normal'
                  ? 300
                  : 0
              })`
            : '',
          deliverycharges,
          total: calculateTotalPrice(),
        });

        if (notificationResponse.data.success) {
          // Notification sent successfully
          alert('Thank You! Your Order Has Been Placed Successfully!');
        } else {
          console.error(
            'Error sending notification:',
            notificationResponse.data.error,
          );
          alert('Error sending notification. Please try again later.');
        }
      } else {
        // Order submission failed
        alert('Error saving data. Please try again later.');
      }
    } catch (error) {
      // Handle any errors that occurred during the process
      alert('An error occurred during checkout. Please try again.');
    } finally {
      // Hide loading indicator
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={orderDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View className="flex-row flex-wrap justify-between items-center p-4 border-b-2 border-b-gray-400">
            <Text
              className="mb-2  text-primary"
              style={{fontFamily: 'Montserrat-SemiBold'}}>
              {item.label}
            </Text>
            <Text
              className=" text-primary"
              style={{fontFamily: 'Montserrat-SemiBold'}}>
              {item.value}
            </Text>
          </View>
        )}
      />
      <Text
        className="text-lg  text-center text-primary top-3"
        style={{fontFamily: 'Montserrat-SemiBold'}}>
        Total Price: {formatPriceAsCurrency(total)}
      </Text>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={handleCheckOut}
          className="justify-center left-3 mb-5 mr-5 items-center mt-8 p-4 bg-primary rounded-xl w-80">
          {loading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <Text
              className="text-white text-xl"
              style={{fontFamily: 'Montserrat-SemiBold'}}>
              Submit Order
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="right-5 top-2 justify-center items-center"
          onPress={printReceipt}>
          <AntDesign name="printer" size={30} color="#000" />
          <Text
            className="text-ternary"
            style={{fontFamily: 'Montserrat-SemiBold'}}>
            Print
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GentsCheckOut;
