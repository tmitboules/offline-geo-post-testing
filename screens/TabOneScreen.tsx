import { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '../components/Themed';
import { Post } from '../Models/Post';
import { useAddPost, useGetPost } from '../network/usePost';

export default function TabOneScreen() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  var { addPostMutation, } = useAddPost();
  const { data } = useGetPost()

  return (
    <View style={styles.container}>
      <TextInput placeholder='Title' style={styles.textInput} placeholderTextColor={'white'} value={title} onChangeText={setTitle}></TextInput>
      <TextInput placeholder='Body' style={styles.textInput} placeholderTextColor={'white'} value={body} onChangeText={setBody}></TextInput>
      <Button title={addPostMutation.isLoading ? 'Submitting data ...' : 'Submit'} onPress={() => {
        const data: Post = {
          title: title,
          body: body,
          geo_location: {
            geo_lat: 122,
            geo_lon: 133,
          }
        }
        addPostMutation.mutateAsync(data).then(() => {
          setBody('')
          setTitle('')
        });
      }} />

      {data && data.locatedPosts &&
        <FlatList
          style={{ width: '100%' }}
          keyExtractor={item => item.id}
          data={data.locatedPosts}
          renderItem={({ item }) =>
            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, marginHorizontal: 10, paddingVertical: 10 }}>
              <Text style={{ color: 'white' }}>{`title: ${item.located_post.title}`}</Text>
              <Text style={{ marginTop: 10, color: 'white' }}>{`body: ${item.located_post.body}`}</Text>
            </View>
          }>
        </FlatList>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10
  },
  textInput: { borderRadius: 8, borderWidth: 1, borderColor: 'white', padding: 10, margin: 10, color: 'white', width: '100%' },
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
