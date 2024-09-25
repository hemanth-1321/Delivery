import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axiosInstance from "../axiosInstance";

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    regno: "",
    licence: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/delivery/signup", formData);
      Alert.alert("Success", "User registered!");
      setLoading(false);
      navigation.navigate("SignIn");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100} // Adjust based on your screen
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.logo}>Kwik</Text>
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(value) => setFormData({ ...formData, name: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          keyboardType="numeric"
          onChangeText={(value) => setFormData({ ...formData, mobile: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(value) => setFormData({ ...formData, email: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Reg No"
          onChangeText={(value) => setFormData({ ...formData, regno: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Licence"
          onChangeText={(value) => setFormData({ ...formData, licence: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={(value) => setFormData({ ...formData, address: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(value) =>
            setFormData({ ...formData, password: value })
          }
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.switchText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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

export default SignUp;
