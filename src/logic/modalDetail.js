import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

const DetailModal = ({ isVisible, onClose, id, name, price, date, createdAt, type, userId }) => {
  const db = firebase.firestore();
  const initialState = {
    id: "",
    name: name,
    price: price,
  };
  useEffect(() => {
    setUser({
      id: id,
      name: name,
      price: price,
    });
  }, [id, name, price]);

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleChangeText = (value, name) => {
    setUser({...user, [name]: value});
  };

  const getUserByID = async(id) => {
    const dbRef = db.collection(type).doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({...user, id: doc.id});
    setLoading(false);
  };

  const deleteUser = async() => {
    const confirmDelete = window.confirm("Você deseja mesmo deletar?");
  if (confirmDelete) {
    const dbRef = db.collection(type).doc(user.id);
    await dbRef.delete();
    onClose();
  }
  };

  const updateUser = async() => {
    const userRef = db.collection(type).doc(id);
    await userRef.set({
      createdAt: createdAt,
      date: date,
      name: user.name,
      price: user.price,
      userId: userId
    })
    setUser(initialState);
    onClose();
  };

  useEffect(() => {
    getUserByID(id);
  }, [id]);

  return (
  <Modal isVisible={isVisible} backdropOpacity={0.5}>
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 12}} onPress={onClose}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#805C5C" }}>X</Text>
        </TouchableOpacity>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nome"
          autoCompleteType="username"
          value={user.name}
          onChangeText={(value) => handleChangeText(value, "name")}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Valor"
          autoCompleteType="price"
          value={user.price}
          onChangeText={(value) => handleChangeText(value, "price")}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={() => updateUser()}>
        <Text style={styles.loginText}>Atualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={() => deleteUser()}>
        <Text style={styles.loginText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)
}

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

export default DetailModal;