import { createPayment } from './resultadoCalculo';

export function performCalculation(myArray, despesa, userId) {
  console.log(myArray, despesa);
  const rendas = extractPrices(myArray);
  const pagantes = extractNames(myArray);
  console.log(rendas);
  console.log(pagantes);
  const totalRenda = rendas.reduce((total, price) => total + price, 0);
  console.log('Total Renda:', totalRenda);
  console.log('Total Despesa:', despesa);
  const aPagar = rendas.map((price, index) => {
    const result = (price * 100) / totalRenda;
    return result;
  });
  const pagamentoIndividual = aPagar.map((price, index) => {
    const result = (despesa * price) / 100;
    return result;
  });
    console.log(pagamentoIndividual);
  const newArray = pagantes.map((name, index) => ({
    name: name,
    price: pagamentoIndividual[index].toFixed(2)
  }));
  console.log('New Array of Objects:', newArray);
  createPayment(newArray, userId);
  return newArray;
}

function extractPrices(networth) {
  const pricesArray = networth.map(item => {
    const itemPrice = parseFloat(item.price);
    if (!isNaN(itemPrice)) {
      return itemPrice;
    }
    return 0;
  });

  return pricesArray;
}

function extractNames(myArray) {
  const namesArray = myArray.map(item => {
    return item.name;
  });

  return namesArray;
}