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


export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Create account
      </Text>

      <Text style={styles.subtitle}>
        Start your PhysioFlow journey
      </Text>


      <TextInput
        placeholder="Name"
        placeholderTextColor="#777"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />


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

          try {

            const response = await fetch(
              "http://192.168.1.8:8002/signup",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  name,
                  email,
                  password,
                }),
              }
            );


            const data = await response.json();


            if (response.ok) {

              Alert.alert(
                "Success",
                "Account created"
              );

              router.push("/login");

            } else {

              Alert.alert(
                "Error",
                JSON.stringify(data)
                );

            }


          } catch (error) {

            Alert.alert(
              "Error",
              "Cannot connect to server"
            );

          }

        }}
      >
        <Text style={styles.buttonText}>
          Sign Up
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => router.push("/login")}
      >
        <Text style={styles.login}>
          Already have an account? Login
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
    fontSize:16,
    fontWeight:"700",
  },


  login:{
    color:"#aaa",
    textAlign:"center",
    marginTop:25,
  }

});