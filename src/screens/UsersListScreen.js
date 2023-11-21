import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from "react-native-elements";
import { performCalculation } from '../logic/calculo';
import firebase from '../database/firebase';
import ExpenseModal from '../logic/modal';
import NetworthModal from '../logic/modalNet';
import DetailModal from '../logic/modalDetail';

function UserListScreen(props) {
  const { userId } = props.route.params;
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
  const [isNetworthModalVisible, setNetworthModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedItemPrice, setSelectedItemPrice] = useState(null);
  const [selectedItemDate, setSelectedItemDate] = useState(null);
  const [selectedItemCreatedAt, setSelectedItemCreatedAt] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [result, setResult] = useState([]);

  const toggleDetailModal = () => {
    setDetailModalVisible(!isDetailModalVisible);
  };

  const toggleExpenseModal = () => {
    setExpenseModalVisible(!isExpenseModalVisible);
  };

  const toggleNetworthModal = () => {
    setNetworthModalVisible(!isNetworthModalVisible);
  };
  
  const db = firebase.firestore();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const userCollectionRef = db.collection('users').where('userId', '==', userId);

    const unsubscribe = userCollectionRef.onSnapshot((querySnapshot) => {
      const usersData = [];
      let totalAmount = 0;

      querySnapshot.forEach((doc) => {
        const { name, price, date, createdAt } = doc.data();
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        const documentDate = new Date(year, month, day);
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        if (documentDate.getMonth() === currentMonth && documentDate.getFullYear() === currentYear) {
          usersData.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });

          totalAmount += parseFloat(price);
        }
      });

      setUsers(usersData);
      setTotal(totalAmount.toFixed(2));
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const [networths, setNetworths] = useState([]);
  const [totalNetworth, setTotalNetworth] = useState(0);

  useEffect(() => {
    const userNetworthsRef = db.collection('networths').where('userId', '==', userId);

    const unsubscribe = userNetworthsRef.onSnapshot((querySnapshot) => {
      const networthsData = [];
      let totalNetworthValue = 0;

      querySnapshot.forEach((doc) => {
        const { name, price, date, createdAt } = doc.data();
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        const documentDate = new Date(year, month, day);
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        if (documentDate.getMonth() === currentMonth && documentDate.getFullYear() === currentYear) {
          networthsData.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });

          totalNetworthValue += parseFloat(price);
        }
      });

      setNetworths(networthsData);
      setTotalNetworth(totalNetworthValue.toFixed(2));
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const combinedData = [
    ...users.map(user => ({ ...user, type: 'users' })),
    ...networths.map(networth => ({ ...networth, type: 'networths' }))
  ];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredCombinedData = combinedData.filter(item => {
    const itemDate = new Date(item.createdAt);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const sortedCombinedData = filteredCombinedData
    .slice()
    .sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

  const handleCalculate = () => {
    const calculatedResult = performCalculation(networths, total, userId);
    setResult(calculatedResult);
  };

    const getAvatarSource = (sortedCombinedData) => {
  if (sortedCombinedData === 'networths') {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Eo_circle_light-green_arrow-up.svg/512px-Eo_circle_light-green_arrow-up.svg.png?20200417151321";
  } else {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Eo_circle_red_white_arrow-down.svg/512px-Eo_circle_red_white_arrow-down.svg.png?20200417174258";
  }
};

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {result.map((item, index) => (
          <ListItem
            key={index}
            bottomDivider
          >
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: 'bold', fontSize: 18,}}>{item.name}</ListItem.Title>
                <ListItem.Subtitle style={{fontWeight: 'bold'}}>Deverá pagar</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content right>
                  <ListItem.Title right style={{fontWeight: 'bold', fontSize: 18,}}>
                    R${item.price}
                  </ListItem.Title>
                </ListItem.Content>
          </ListItem>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text style={styles.rendaText}>Total Renda:</Text>
        <Text style={styles.despesaText}>Total Despesas:</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
        <Text style={styles.rendaText}>R$ {totalNetworth}</Text>
        <Text style={styles.despesaText}>R$ {total}</Text>
      </View>
        {sortedCombinedData.map((item) => {
          const avatarSource = getAvatarSource(item.type);
          return (
            <ListItem
              key={item.id}
              bottomDivider
              onPress={() => {
                setSelectedItemId(item.id);
                setSelectedItemName(item.name);
                setSelectedItemPrice(item.price);
                setSelectedItemDate(item.date);
                setSelectedItemCreatedAt(item.createdAt);
                setSelectedItemType(item.type);
                toggleDetailModal();
              }}
            >  
              <ListItem.Chevron />
              <Avatar source={{ uri: avatarSource }} rounded />
              <ListItem.Content>
                <ListItem.Title style={{fontWeight: 'bold', fontSize: 18,}}>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Content right>
                  <ListItem.Title right style={{fontWeight: 'bold', fontSize: 18,}}>
                    R${item.price}
                  </ListItem.Title>
                </ListItem.Content>
            </ListItem>
          );
        })}
        <DetailModal
          isVisible={isDetailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          id={selectedItemId}
          name={selectedItemName}
          price={selectedItemPrice}
          date={selectedItemDate}
          createdAt={selectedItemCreatedAt}
          type={selectedItemType}
          userId={userId}
        />
  </ScrollView>
  <View style={{bottom: 0, right: 0, left: 0, padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 }}>
  <TouchableOpacity
    style={{
      width: 95,
      height: 50,
      borderRadius: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    }}
    onPress={toggleNetworthModal}
  >
    <NetworthModal isVisible={isNetworthModalVisible} onClose={toggleNetworthModal} userId={ userId } />
    <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }}>&#x1F911;</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      width: 95,
      height: 50,
      borderRadius: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    }}
    onPress={toggleExpenseModal}
  >
    <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }}>&#x1F4B8;</Text>
    <ExpenseModal isVisible={isExpenseModalVisible} onClose={toggleExpenseModal} userId={ userId } />
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      width: 95,
      height: 50,
      borderRadius: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    }}
    onPress={handleCalculate}
  >
    <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }}>&#x2797;</Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

const styles = {
  despesaText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red',
  },
  rendaText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'green',
  },
};

export default UserListScreen;