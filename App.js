import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('ostoksetdb.db');


export default function App() {
  const [ostos, setOstos] = useState('');
  const [ostokset, setOstokset] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists ostokset (id integer primary key not null,ostos text);');//credits poistettiin
    });
    updateList();    
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into ostokset (ostos) values (?);', [ ostos]);    
      }, null, updateList
    )
  }


const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from ostokset;', [], (_, { rows }) =>
    setOstokset(rows._array)
    );
  setOstos('');
  });
}

const deleteItem = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(`delete from ostokset where id = ?;`, [id]);
    }, null, updateList,
  )    
}

return (
  <View style={styles.container}>
    <TextInput placeholder='Ostos' style={styles.input} value={ostos} onChangeText={ostos => setOstos(ostos)} />
    <Button title='Lisää' onPress={saveItem}></Button>

    <FlatList
    style={{marginLeft : "5%"}}      
      keyExtractor={item => item.id.toString()} 
      renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.ostos}</Text>
      <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Poista</Text></View>}
      data={ostokset}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: '10%',
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  input:{
    marginTop: '20%',
    fontSize: 18,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
});
