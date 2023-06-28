import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddPostWithAxios } from '../App';

import { Text, View } from '../components/Themed';
import baseInstance from '../instances/baseInstance';
import { Post, PostResponse } from '../Models/Post';

export default function TabOneScreen() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  var { addPostMutation } = useAddPostWithAxios();

  const getPostList = async (): Promise<PostResponse> => {
    const instance = await baseInstance();

    const { data }: { data: PostResponse } = await instance.get("locatedPost/GetList");
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPostList,
  })


  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <TextInput placeholder='Title' style={styles.textInput} placeholderTextColor="white" value={title} onChangeText={setTitle}></TextInput>
      <TextInput placeholder='Body' style={styles.textInput} placeholderTextColor="white" value={body} onChangeText={setBody}></TextInput>
      <Button disabled={addPostMutation.isLoading || title.length === 0 || body.length === 0} title={addPostMutation.isLoading ? 'Submitting ....' : 'Submit'} onPress={() => {
        const data: Post = {
          title: title,
          body: body,
          geo_location: {
            geo_lat: 122,
            geo_lon: 133,
          }
        }
        addPostMutation.mutateAsync(data).then(() => {
          setTitle('')
          setBody('')
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    margin: 10,
    width: '100%',
    color: 'white'
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
