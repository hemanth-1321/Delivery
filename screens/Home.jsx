import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axiosInstance from "../axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderDetails = ({ navigation, route }) => {
  const { deliveryPersonId } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [rejectingOrders, setRejectingOrders] = useState([]);
  const [acceptingOrder, setAcceptingOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `acceptOrders/getAssignedOrder/${deliveryPersonId}`
        );
        setOrders(response.data); // Set all orders
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [deliveryPersonId]);

  const handleRejectOrder = async (orderId) => {
    setRejectingOrders((prev) => [...prev, orderId]); // Add order to rejecting state
    setRejectedOrders((prev) => [...prev, orderId]);

    setTimeout(async () => {
      try {
        await axiosInstance.post("acceptOrders/reject-order", {
          orderId: orderId,
        });
        Alert.alert("Success", "Order rejected successfully");

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to reject the order");
      } finally {
        setRejectingOrders((prev) => prev.filter((id) => id !== orderId));
      }
    }, 1000);
  };

  const handleAcceptOrder = async (orderId) => {
    setAcceptingOrder(orderId);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;

        // Set the destination to Brigade Road, Bangalore
        const destination = "12.962,78.271"; // Brigade Road, Bangalore

        const startPoint = `${latitude},${longitude}`;

        const response = await fetch(
          `https://api.geoapify.com/v1/routing?waypoints=${startPoint}|${destination}&mode=drive&apiKey=5c17abb6a60c4f5aa2db6520d1ea9f59`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching route:", errorData);
          Alert.alert(
            "Error",
            "Failed to fetch the route: " + errorData.error.message
          );
          console.log(errorData.error.message);
          return;
        }

        const result = await response.json();

        if (result.routes && result.routes.length > 0) {
          Alert.alert("Route found", "Starting navigation...");
          console.log(result.routes);

          navigation.navigate("MapScreen", {
            startPoint: { latitude, longitude }, // Current location
            destination: { lat: 12.962, lng: 78.271 },
            orderId: orderId,
          });
        } else {
          Alert.alert("Error", "No routes found");
          console.log(error.message);
        }
      } else {
        Alert.alert(
          "Permission denied",
          "Location access is required to accept orders"
        );
      }
    } catch (error) {
      console.error("Error during order acceptance:", error);
      Alert.alert("Error", "Failed to accept the order");
    } finally {
      setAcceptingOrder(null);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem("token");
      Alert.alert("Success", "Signed out successfully!");
      // Navigate to the SignIn screen
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noOrderText}>No orders available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Kwik</Text>
      {orders.map((order) => (
        <View key={order.id} style={styles.orderContainer}>
          <Text style={styles.orderTitle}>Order Details</Text>
          <Text>ID: {order.id}</Text>
          <Text>Customer: {order.customer.name}</Text>
          <Text>Total Amount: ₹{order.totalAmount}</Text>
          <Text>Status: {order.status}</Text>
          {/* Display items */}
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <Text>
                {item.item.name} - Quantity: {item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleAcceptOrder(order.id)}
              disabled={acceptingOrder === order.id}
            >
              {acceptingOrder === order.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Accept</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.rejectButton,
                rejectedOrders.includes(order.id) ||
                rejectingOrders.includes(order.id)
                  ? styles.disabledButton
                  : {},
              ]}
              onPress={() => handleRejectOrder(order.id)}
              disabled={
                rejectedOrders.includes(order.id) ||
                rejectingOrders.includes(order.id)
              }
            >
              {rejectingOrders.includes(order.id) ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1E90FF",
  },
  orderContainer: {
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#ff4d4d",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  noOrderText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  signOutButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
});

export default OrderDetails;
