import { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { Post } from '../Models/Post';
import { useAddPost, useDeletePost, useGetPost, useUpdatePost } from '../network/usePost';

export default function TabOneScreen() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [editingId, setEditingId] = useState(-1)

  var { addPostMutation, } = useAddPost();
  var { updatePostMutation, } = useUpdatePost();
  var { deletePostMutation, } = useDeletePost();
  const { data } = useGetPost()

  const resetFields = () => {
    setBody('')
    setTitle('')
    if (isEdit) {
      setEditingId(-1)
      setIsEdit(isEdit => !isEdit)
    }
  }

  // Render Item Function
  const renderItem = ({ item }: { item: Post }) => {
    const handleEditPress = () => {
      setIsEdit(true);
      setBody(item.body);
      setEditingId(item.id);
      setTitle(item.title);
    };

    const handleDeletePress = () => {
      deletePostMutation.mutate(item.id);
    };

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContentView}>
          <Text style={styles.txtTitle}>{`title: ${item.title}`}</Text>
          <Text style={styles.txtBody}>{`body: ${item.body}`}</Text>
        </View>

        <TouchableOpacity onPress={handleEditPress} style={styles.editBtn}>
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeletePress} style={styles.dltBtn}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Title' style={styles.textInput} placeholderTextColor={'white'} value={title} onChangeText={setTitle} />

      <TextInput placeholder='Body' style={styles.textInput} placeholderTextColor={'white'} value={body} onChangeText={setBody} />

      <Button title={isEdit ? 'Update' : 'Submit'} onPress={() => {
        const data: Post = {
          title: title,
          body: body,
          id: isEdit ? editingId : Date.now()
        }

        if (isEdit) {
          updatePostMutation.mutateAsync(data).then(resetFields);
        } else {
          addPostMutation.mutateAsync(data).then(resetFields);
        }
      }} />

      {data &&
        <FlatList
          style={{ width: '100%' }}
          keyExtractor={item => item.id.toString()}
          data={data}
          renderItem={renderItem}>
        </FlatList>}

    </View>
  );
}



const styles = StyleSheet.create({
  listItem: { borderBottomColor: 'grey', borderBottomWidth: 1, paddingVertical: 10, flex: 1, alignItems: 'center', flexDirection: 'row', },
  editBtn: { backgroundColor: 'grey', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  dltBtn: { backgroundColor: 'red', padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  txtTitle: { color: 'white' },
  txtBody: { marginTop: 10, color: 'white' },
  listItemContentView: { marginHorizontal: 10, flex: 1 },
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
