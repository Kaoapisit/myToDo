import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, Alert,} from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
// import Loading from "./components/Loading";
import firestore, { firebase } from '@react-native-firebase/firestore';





export default function App() {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = firestore()
    .collection('TaskData')
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(documentSnapshot => {
        return{
          _id: documentSnapshot.id,
          date: '',
          value: '',
          ...documentSnapshot.data()
        };
        
      });
      setData(data);

      // if (loading) {
      //   setLoading(false);
      // }
    });
    return () =>unsubscribe();
  },[]);

  const submitHandler = (value, date) => {
    firestore().collection('TaskData').add({
      value: value,
      date: date.toISOString().slice(0, 16),
      key: Math.random().toString(),
    }).then(()=>{
      console.log('Task Add Success')
    })

    // setData((prevTodo) => {
    //   return [
    //     {
    //       value: value,
    //       date: date.toISOString().slice(0, 10),
    //       key: Math.random().toString(),
    //     },
    //     ...prevTodo,
    //   ];
    // });
  };

  const deleteItem = (key) => {
    
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this beautiful box?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            console.log(key)
            const dbRef = firebase.firestore().collection('TaskData').doc(key)
            dbRef.delete().then((res) => {
                console.log('Item removed from database')
            })
            // setData((prevTodo) => {
            //   return prevTodo.filter((todo) => todo.key != key);
            // });
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  const searchItem = (keyword) => {

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
          keyExtractor={(item) => item._id}
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