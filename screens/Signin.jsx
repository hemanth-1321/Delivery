import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // If token exists, navigate to Home
        navigation.navigate("Home");
      }
    };

    checkToken();
  }, []);

  const handleSignIn = async () => {
    setLoading(true); // Show loading spinner when the request starts
    try {
      const response = await axiosInstance.post("/delivery/signin", {
        email,
        password,
      });

      // Correctly access the ID and token from the response
      const { user, token } = response.data; // Destructure user and token from the response
      const { id } = user; // Get the delivery person's ID

      // Store the token in AsyncStorage
      await AsyncStorage.setItem("token", token);

      Alert.alert("Success", "Signed in successfully!");
      setLoading(false); // Hide loading spinner when the request completes
      console.log(id); // Log the ID to the console
      // Pass the ID to the Home screen
      navigation.navigate("Home", { deliveryPersonId: id });
    } catch (error) {
      setLoading(false); // Hide loading spinner if there's an error
      Alert.alert("Error", error.response?.data?.message || "Sign in failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Kwik</Text>
      <Text style={styles.title}>Welcome back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Show ActivityIndicator when loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1E90FF",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  switchText: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E90FF",
    fontSize: 16,
  },
});

export default SignIn;
