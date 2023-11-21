import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import firebase from '../database/firebase';
import { parse, startOfDay } from 'date-fns';

function GraphScreen(props) {
  const db = firebase.firestore();
  const { userId } = props.route.params;
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [monthNetworthData, setMonthNetworthData] = useState([]);
  const [monthPaymentsData, setMonthPaymentsData] = useState([]);

  const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

  useEffect(() => {
    const userCollectionRef = db.collection('users').where('userId', '==', userId);

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

        console.log('Data for each month:', monthData);
        const fetchedSelectedData = Object.keys(monthData).map(key => ({
          number: key,
          total: monthData[key].total
        }));
        setSelectedData(fetchedSelectedData);
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const [networths, setNetworths] = useState([]);
  const [totalNetworth, setTotalNetworth] = useState(0);

  useEffect(() => {
    const userNetworthsRef = db.collection('networths').where('userId', '==', userId);

    const unsubscribe = userNetworthsRef.onSnapshot(
      (querySnapshot) => {
        const networthsData = [];
        let totalNetworthValue = 0;
        const monthNetworthData = {};

        querySnapshot.forEach((doc) => {
          const { name, price, date, createdAt } = doc.data();

          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          const startOfDayDate = startOfDay(parsedDate);
          const monthKey = startOfDayDate.getMonth() + 1;

          if (!monthNetworthData[monthKey]) {
            monthNetworthData[monthKey] = {
              total: 0,
              data: [],
            };
          }

          networthsData.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });

          monthNetworthData[monthKey].total += parseFloat(price);
          monthNetworthData[monthKey].data.push({
            id: doc.id,
            name,
            price,
            date,
            createdAt,
          });
        });

        setNetworths(networthsData);
        setTotalNetworth(totalNetworthValue.toFixed(2));

        console.log('Networth data for each month:', monthNetworthData);
        const fetchedSelectedNetworthData = Object.keys(monthNetworthData).map(key => ({
          number: key,
          total: monthNetworthData[key].total
        }));
        setMonthNetworthData(fetchedSelectedNetworthData);
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

    const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const userPaymentsRef = db.collection('payments').where('userId', '==', userId);

    const unsubscribe = userPaymentsRef.onSnapshot(
      (querySnapshot) => {
        const paymentsData = [];
        let totalPaymentsValue = 0;
        const monthPaymentsData = {};

        querySnapshot.forEach((doc) => {
          const { name, price, date } = doc.data();

          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          const startOfDayDate = startOfDay(parsedDate);
          const monthKey = startOfDayDate.getMonth() + 1;

          if (!monthPaymentsData[monthKey]) {
            monthPaymentsData[monthKey] = {
              total: 0,
              data: [],
            };
          }

          paymentsData.push({
            id: doc.id,
            name,
            date,
            price,
          });

          monthPaymentsData[monthKey].total += parseFloat(price);
          monthPaymentsData[monthKey].data.push({
            id: doc.id,
            name,
            date,
            price,
          });
        });

        setPayments(paymentsData);
        setTotalPayments(totalPaymentsValue.toFixed(2));

        console.log('Payments data for each month:', monthPaymentsData);
        const fetchedSelectedPaymentsData = Object.keys(monthPaymentsData).map(key => ({
          number: key,
          data: monthPaymentsData[key].data.map(payment => ({
            name: payment.name,
            price: payment.price,
          })),
        }));

        setMonthPaymentsData(fetchedSelectedPaymentsData);
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [userId]);

  const allMonthKeys = [...new Set([...Object.keys(selectedData), ...Object.keys(monthNetworthData), ...Object.keys(monthPaymentsData)])];
  const combinedTotalArray = allMonthKeys.map(monthKey => {
    const nestedKey = selectedData[monthKey] ? monthNames[selectedData[monthKey].number - 1] : '';
    const totalFromMonthData = selectedData[monthKey] ? selectedData[monthKey].total : 0;
    const totalFromMonthNetworthData = monthNetworthData[monthKey] ? monthNetworthData[monthKey].total : 0;
    const thirdArrayData = monthPaymentsData[monthKey] ? monthPaymentsData[monthKey].data : [];
    const thirdArrayExtractedFields = thirdArrayData.map(item => ({
      name: item.name,
      price: item.price
    }));
    return {
      month: nestedKey,
      totalFromData: totalFromMonthData,
      totalFromNetworthData: totalFromMonthNetworthData,
      balance: totalFromMonthNetworthData - totalFromMonthData,
      thirdArrayExtractedFields: thirdArrayExtractedFields
    };
  });

  console.log(combinedTotalArray);

  const data = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  monthPaymentsData.forEach((monthData) => {
    const monthLabel = monthNames[parseInt(monthData.number, 10) - 1];
    monthData.data.forEach((payment) => {
      data.labels.push(`${monthLabel} - ${payment.name}`);
      data.datasets[0].data.push(parseFloat(payment.price) || 0);
    });
  });

  const CombinedTotalItem = ({ month, totalFromData, totalFromNetworthData, balance, thirdArrayExtractedFields }) => (
    <View style={{ padding: 10 }}>
    <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{month}</Text>
      </View>
      <Text>Total das Despesas: R$ {totalFromData}</Text>
      <Text>Total das Receitas: R$ {totalFromNetworthData}</Text>
      <Text>Balanço do mês: <Text style={{ color: balance < 0 ? 'red' : 'green' }}>R$ {balance}</Text></Text>
      <View style={{paddingTop: 10}}>
      {thirdArrayExtractedFields.map((field, index) => (
      <Text key={index}>{`${field.name} pagou R$${field.price}`}</Text>
    ))}
    </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={combinedTotalArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CombinedTotalItem
            month={item.month}
            totalFromData={item.totalFromData}
            totalFromNetworthData={item.totalFromNetworthData}
            balance={item.balance}
            thirdArrayExtractedFields={item.thirdArrayExtractedFields}
          />
        )}
      />
    </View>
  );
}

export default GraphScreen;