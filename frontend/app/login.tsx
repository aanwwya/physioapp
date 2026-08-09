import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../lib/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome back
      </Text>


      <Text style={styles.subtitle}>
        Login to continue learning
      </Text>


      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />


      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />


      <TouchableOpacity
        style={styles.button}
        onPress={async () => {

          console.log("API:", API_URL);
          console.log("EMAIL:", email);

          try {

            const response = await fetch(
              `${API_URL}/login`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },

                body: new URLSearchParams({
                  username: email,
                  password: password,
                }).toString(),

              }
            );


            const data = await response.json();


            if (response.ok) {

              await AsyncStorage.setItem(
                "token",
                data.access_token
              );


              Alert.alert(
                "Success",
                "Logged in"
              );


              router.push("/(tabs)");

            } else {

              Alert.alert(
                "Error",
                data.detail || "Login failed"
              );

            }

} catch (error) {
        console.log("LOGIN ERROR:", error);

        Alert.alert(
          "Login Error",
          String(error)
        );
      }
              }}
      >

        <Text style={styles.buttonText}>
          Login
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => router.push("/signup")}
      >

        <Text style={styles.signup}>
          Don't have an account? Create one
        </Text>

      </TouchableOpacity>


    </View>

  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#000",
    justifyContent:"flex-start",
    padding:30,
    paddingTop:120,
  },

  title:{
    color:"#fff",
    fontSize:34,
    fontWeight:"700",
    marginBottom:10,
  },

  subtitle:{
    color:"#aaa",
    fontSize:16,
    marginBottom:40,
  },

  input:{
    backgroundColor:"#111",
    color:"#fff",
    padding:16,
    borderRadius:14,
    marginBottom:18,
    borderWidth:1,
    borderColor:"#333",
  },

  button:{
    backgroundColor:"#fff",
    padding:17,
    borderRadius:30,
    alignItems:"center",
    marginTop:10,
  },

  buttonText:{
    color:"#000",
    fontWeight:"700",
    fontSize:16,
  },

  signup:{
    color:"#aaa",
    textAlign:"center",
    marginTop:25,
  },

});