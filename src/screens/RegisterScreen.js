import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import firebase from '../database/firebase';

function RegisterScreen( { navigation } ) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function createUserFirebase() {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((user) => {
        console.log("createUserFirebase=Usuário criado com sucesso");
        alert('Usuário criado com sucesso');
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("createUserFirebase=Falha ao criar usuário:", errorCode, errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Popt</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#a83a32"
            onChangeText={email => setEmail(email)} value={email}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Senha..."
            placeholderTextColor="#a83a32"
            onChangeText={senha => setSenha(senha)} value={senha}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => { createUserFirebase() }}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "black",
    marginBottom: 40
  },
  inputView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  inputText: {
    height: 50,
    color: "#a83a32",
  },
  forgot: {
    color: "gray",
    fontSize: 13,
    textDecorationLine: 'underline'
  },
  inputContainer: {
    width: "83%",
    marginBottom: 5,
  },
  forgotContainer: {
    alignSelf: "flex-end",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#805C5C",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  loginText: {
    color: "white"
  },
  registerText: {
    color: 'gray',
    marginTop: 15
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: 'gray',
  },
});

export default RegisterScreen;