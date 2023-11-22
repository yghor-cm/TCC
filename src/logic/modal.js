import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

const ExpenseModal = ({ isVisible, onClose, userId }) => {
  const db = firebase.firestore();
  const initialState = {
    id: "",
    name: "",
    price: 0,
    date: "",
    userId: ""
  };

  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  const [state, setState] = useState();

  const handleChangeText = (value, name) => {
    setState({...state, [name]: value});
  };

  const saveNewUser = async () => {
    try {
      const timestamp = Date.now();
      await db.collection('users').add({
        name: state.name,
        price: state.price,
        date: formattedDate,
        userId: userId,
        createdAt: timestamp
      });
      onClose();
    } catch(e){
      console.log(e);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 12}} onPress={onClose}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#805C5C" }}>X</Text>
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 15, paddingBottom: 10}}>Nova Despesa</Text>
        <View style={styles.inputView}>
        <TextInput style={styles.inputText} placeholder="Nome" placeholderTextColor="#a83a32" onChangeText={(value) => handleChangeText(value, "name")}/>
        </View>
        <View style={styles.inputView}>
        <TextInput style={styles.inputText} placeholder="Valor" placeholderTextColor="#a83a32" keyboardType="numeric" onChangeText={(value) => handleChangeText(value, "price")}/>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={() => saveNewUser()}>
        <Text style={styles.loginText}>Adicionar</Text>
      </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: "80%",
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
  loginBtn: {
    width: "60%",
    backgroundColor: "#805C5C",
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
});

export default ExpenseModal;