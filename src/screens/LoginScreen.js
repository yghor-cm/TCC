import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import firebase from '../database/firebase';

function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  function loginFirebase() {
    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        var user = userCredential.user;
        var uid = user.uid;
        props.navigation.navigate('AuthenticatedScreens', { userId: uid });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode, errorMessage);
        console.log("loginFirebase=" + errorCode + "/" + errorMessage);
      });
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setMensagem('Usuário conectado');
      } else {
        console.log("useEffect=Usuário não logado");
      }
    });
  }, []);

      function changePassword() {
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          alert("Email de redefinição de senha enviado!")
        }).catch((error) => {
          alert("Digite seu email no campo email")
        })
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
      <TouchableOpacity style={styles.forgotContainer} onPress={() => { changePassword() }}>
        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.loginBtn} onPress={() => { loginFirebase() }}>
      <Text style={styles.loginText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => { props.navigation.navigate('RegisterScreen') }}>
  <Text style={styles.registerText}>
    Não possui uma conta?{' '}
    <Text style={styles.underlineText}>
      Registre-se
    </Text>
  </Text>
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
export default LoginScreen;