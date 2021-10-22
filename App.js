import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, Alert,} from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
import firestore, { firebase } from '@react-native-firebase/firestore';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
    .collection('TaskData')
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(docSnapshot => {
        return{
          primaryid: docSnapshot.id,
          date: '',
          value: '',
          ...docSnapshot.data()
        };
        
      });
      setData(data);
    });
  },[]);

  const submitHandler = (value, date) => {
    firestore().collection('TaskData').add({
      value: value,
      date: date.toUTCString().slice(5, 16),
      key: Math.random().toString(),
    }).then(()=>{
      console.log('Task Add Success.')
    })
  };

  const deleteItem = (key) => {
    
    return Alert.alert(
      "คุณแน่ใจหรือไม่?",
      "คุณแน่ใจหรือไม่ที่ต้องการลบรายการนี้?",
      [
        {
          text: "ใช่ฉันแน่ใจ",
          onPress: () => {
            console.log(key)
            const unsubRef = firebase.firestore().collection('TaskData').doc(key)
            unsubRef.delete().then(() => {
                console.log('Item removed from database')
            })
          },
        },
        {
          text: "ยกเลิก",
        },
      ]
    );
  };

  const searchItem = (keyword) => {
    console.log(keyword);
    const unsubscribe = firestore()
    .collection('TaskData')
    .where('value', '>=', keyword)
    .where('value', '<=', keyword)
    .get().then(querySnapshot => {         
      const users = [];                 
      querySnapshot.forEach(doc => {                     
        users.push(doc.data());
        console.log(doc.data());
      })        
      setData(users);
    });
  }

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="#00bf6c" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header searchItem={searchItem} />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.primaryid}
          renderItem={({ item }) => (
            <TodoList item={item} deleteItem={deleteItem} />
          )}
        />
        <View>
          <AddInput submitHandler={submitHandler} />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: #00bf6c;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;