import { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '../components/Themed';
import { ContentVideo } from '../Models/ContentVideo';
import { Post } from '../Models/Post';
import { useAddContentVideo, useGetContentViedeos } from '../network/useContentVideo';

export default function TabTwoScreen() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  var { addContentVideoMutation, } = useAddContentVideo();
  const { data } = useGetContentViedeos()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput placeholder='Title' style={styles.textInput} placeholderTextColor={'white'} value={title} onChangeText={setTitle}></TextInput>
        <TextInput placeholder='Description' style={styles.textInput} placeholderTextColor={'white'} value={body} onChangeText={setBody}></TextInput>
        <Button  title={addContentVideoMutation.isLoading ? 'Submitting data ...' : 'Submit'} onPress={() => {
          const data: ContentVideo = {
            title: title,
            description: body,
            links: '',
            username: '',
            id: '',
            userId: ''
          }
          addContentVideoMutation.mutateAsync(data).then(() => {
            setBody('')
            setTitle('')
          });
        }} />

        {data && data.contentVideos &&
          <FlatList
            style={{ width: '100%' }}
            keyExtractor={item => item.id}
            data={data.contentVideos}
            renderItem={({ item }) =>
              <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, marginHorizontal: 10, paddingVertical: 10 }}>
                <Text style={{ color: 'white' }}>{`title: ${item.title}`}</Text>
                <Text style={{ marginTop: 10, color: 'white' }}>{`body: ${item.description}`}</Text>
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
