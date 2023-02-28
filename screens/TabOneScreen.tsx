import { useState } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { useAddPost } from '../App';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Post } from '../Models/Post';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

    var addPostAPICall = useAddPost();
  

  return (
    <View style={styles.container}>
        <TextInput placeholder='title' style={{ borderWidth: 1, borderColor: 'red', padding: 10, marginHorizontal: 10, marginTop: 120 }} value={title} onChangeText={setTitle}></TextInput>
          <TextInput placeholder='body' style={{ borderWidth: 1, borderColor: 'red', padding: 10, margin: 10 }} value={body} onChangeText={setBody}></TextInput>
          <Button title='Submit' onPress={() => {
            const postData: Post = {
              title: title,
              body: body,
              geo_location: {
                geo_lat: 122,
                geo_lon: 133,
              }
            }

            addPostAPICall.mutate(postData, {
              onSettled: (res) => {
                // console.log("useAddComment");
                console.log(res);
              },
            });

          }}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
