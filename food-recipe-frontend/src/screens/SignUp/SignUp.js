import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import {getServer } from "../../data/MockDataAPI";

export default function SignUp(props){  
    const { navigation } = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSignUp = async () => {
        const response = await fetch(`${SERVER_URL}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (response.ok) {
          Alert.alert('Success', 'User created successfully');
          navigation.navigate("Home", { props });

        } else {
          Alert.alert('Error', 'Failed to create user');
        }
      };
    function logIn(){
        navigation.navigate("Login", { props });
    }
    
    return (
        <View style={styles.container}>
          <Image style={styles.image} source={require("../../../assets/icons/list.png")} /> 
          <StatusBar style="auto" />
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Name."
              placeholderTextColor="#003f5c"
              onChangeText={(name) => setName(name)}
            /> 
          </View> 
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email."
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            /> 
          </View> 
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            /> 
          </View> 
          <TouchableOpacity>
            <Text style={styles.register} onPress={() => logIn()}>Already have an account? Login</Text> 
          </TouchableOpacity> 
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText} onPress={() => handleSignUp()}>Signup</Text> 
          </TouchableOpacity> 
        </View> 
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      marginBottom: 40,
    },
    inputView: {
      backgroundColor: "#DDD",
      borderRadius: 30,
      width: "70%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
    register: {
      height: 30,
      marginBottom: 30,
    },
    loginBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#BBB",
    },
  });