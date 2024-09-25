import React, { useEffect, useState } from "react";

const MapScreen = ({ route }) => {
  const { startPoint, destination, orderId } = route.params;

  useEffect(() => {
    console.log("Start Point:", startPoint);
    console.log("Destination:", destination);
  }, []);

  return (
    <View>
      <Text>Order ID: {orderId}</Text>
    </View>
  );
};

export default MapScreen;
