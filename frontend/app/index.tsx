import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";


export default function LandingPage() {

  return (
    <View style={styles.container}>

      <View style={styles.center}>

        <Text style={styles.logo}>
          PhysioFlow
        </Text>


        <Text style={styles.tagline}>
          Learn. Understand. Remember.
        </Text>


        <Text style={styles.description}>
          Your physiotherapy study companion
        </Text>


        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >

          <Text style={styles.buttonText}>
            Get Started
          </Text>

        </TouchableOpacity>


      </View>

    </View>
  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#000",
  },


  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:30,
  },


  logo:{
    color:"#fff",
    fontSize:55,
    fontStyle:"italic",
    fontWeight:"700",
    marginBottom:25,
  },


  tagline:{
    color:"#fff",
    fontSize:22,
    fontWeight:"600",
    marginBottom:15,
  },


  description:{
    color:"#aaa",
    fontSize:16,
    textAlign:"center",
    marginBottom:50,
  },


  button:{
    backgroundColor:"#fff",
    paddingVertical:16,
    paddingHorizontal:45,
    borderRadius:40,
  },


  buttonText:{
    color:"#000",
    fontSize:16,
    fontWeight:"700",
  },

});