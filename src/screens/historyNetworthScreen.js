import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Avatar } from "react-native-elements";
import firebase from '../database/firebase';
import { LineChart, BarChart } from 'react-native-chart-kit';
import VisualModal from '../logic/modalVisual';
import { parse, startOfDay } from 'date-fns';

function HistoryNetworthScreen (props) {
  const db = firebase.firestore();
  const { userId } = props.route.params;
  const [users, setUsers]= useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedMonthData, setSelectedMonthData] = useState([]);
  const [isVisualModalVisible, setVisualModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedItemPrice, setSelectedItemPrice] = useState(null);
  const [selectedItemDate, setSelectedItemDate] = useState(null);
  const [selectedItemCreatedAt, setSelectedItemCreatedAt] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  const toggleVisualModal = () => {
    setVisualModalVisible(!isVisualModalVisible);
  };

  function getMonthName(monthNumber) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthNumber - 1];
  }

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];

  useEffect(() => {
    const userCollectionRef = db.collection('networths').where('userId', '==', userId);

    const unsubscribe = userCollectionRef.onSnapshot(
      (querySnapshot) => {
        const users = [];
        let total = 0;
        const monthData = {};

        querySnapshot.forEach((doc) => {
          const { name, price, date, createdAt } = doc.data();

          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          const startOfDayDate = startOfDay(parsedDate);
          const monthKey = startOfDayDate.getMonth() + 1;

          if (!monthData[monthKey]) {
            monthData[monthKey] = {
              total: 0,
              data: [],
            };
          }

          users.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });

          monthData[monthKey].total += parseInt(price, 10);
          monthData[monthKey].data.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });
        });

        setUsers(users);
        setTotal((total / 100).toFixed(2));
        const fetchedSelectedData = Object.keys(monthData).map(key => ({
          number: key,
          total: monthData[key].total
        }));
        setSelectedData(monthData);
        setSelectedMonthData(fetchedSelectedData)
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }     
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);
  var sum2 = selectedMonthData.reduce(function (acc, obj) {
    return acc + obj.total;
}, 0);

const chartNetworthsData = {
    labels: selectedMonthData.map((data) => monthNames[parseInt(data.number, 10) - 1]),
    datasets: [
      {
        data: selectedMonthData.map((data) => data.total),
      },
    ],
  };

  const getAvatarSource = () => {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Eo_circle_light-green_arrow-up.svg/512px-Eo_circle_light-green_arrow-up.svg.png?20200417151321";
};

return (
  <View style={{flex: 1}}>
  <ScrollView>
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Receitas</Text>
        <LineChart
          data={chartNetworthsData}
          width={320}
          height={200}
          fromZero={true}
          yAxisLabel={'R$'}
          chartConfig={{
            backgroundGradientFrom: '#F0F0F0',
            backgroundGradientTo: '#F0F0F0',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            decimalPlaces: 2,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#008000',
              fill: '#008000',
            },
          }}
          style={{ marginVertical: 10 }}
          bezier
        />
      </View>
    {Object.keys(selectedData).map((monthKey) => (
  <View key={monthKey}>
    <Text style={styles.totalText}>{getMonthName(parseInt(monthKey))}</Text>
    {selectedData[monthKey].data.map((item) => {
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
            toggleVisualModal();
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
  </View>
))}
    <VisualModal
      isVisible={isVisualModalVisible}
      onClose={() => setVisualModalVisible(false)}
      id={selectedItemId}
      name={selectedItemName}
      price={selectedItemPrice}
      date={selectedItemDate}
      createdAt={selectedItemCreatedAt}
      type={selectedItemType}
      userId={userId}
    />
  <View>
  <Text style={styles.totalText}>Total de Receitas: R$ {sum2}</Text>
  </View>
  </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  totalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HistoryNetworthScreen;