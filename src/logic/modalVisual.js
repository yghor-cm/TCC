import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

const VisualModal = ({ isVisible, onClose, id, name, price, date, createdAt, type, userId }) => {
  const db = firebase.firestore();
  const initialState = {
    id: "",
    name: name,
    price: price,
    date: date,
  };
  useEffect(() => {
    setUser({
      id: id,
      name: name,
      price: price,
      date: date,
    });
  }, [id, name, price, date]);

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const getUserByID = async(id) => {
    const dbRef = db.collection(type).doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({...user, id: doc.id});
    setLoading(false);
  };


  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 12}} onPress={onClose}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#805C5C" }}>X</Text>
        </TouchableOpacity>
        <View style={styles.inputView}>
        <Text style={styles.inputText}>Nome: {user.name}</Text>
        </View>
        <View style={styles.inputView}>
        <Text style={styles.inputText}>Valor: {user.price}</Text>
        </View>
        <View style={styles.inputView}>
        <Text style={styles.inputText}>Data: {user.date}</Text>
        </View>   
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputView: {
    alignItems: "center",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 40,
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
    marginTop: 20,
    justifyContent: "center",
    height: 50,
    color: "#a83a32",
  },
});

export default VisualModal;