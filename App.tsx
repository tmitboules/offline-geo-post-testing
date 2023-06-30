import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { AppStateStatus, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text } from './components/Themed';

import { useAppState } from './hooks/useAppState';
import { useDefaultQueryClient } from './hooks/useDefaultQueryClient';
import { useOnlineManager } from './hooks/useOnlineManager';
import TabOneScreen from './screens/TabOneScreen';
import TabTwoScreen from './screens/TabTwoScreen';


function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
})

const { defaultQueryClient } = useDefaultQueryClient()

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <PersistQueryClientProvider
      client={defaultQueryClient}
      persistOptions={{ maxAge: Infinity, persister: asyncStoragePersister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        defaultQueryClient.resumePausedMutations().then(() => {
          defaultQueryClient.invalidateQueries();
        });
      }}>
      <SafeAreaProvider>
        <StatusBar style='dark' />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 50, backgroundColor: 'grey', flexDirection: 'row', }}>
              <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectedTab(0)}>
                <Text>Post</Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: '100%', backgroundColor: 'white' }}></View>
              <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectedTab(1)}>
                <Text>Videos</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: 'black', }}>
              <Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', paddingTop: 20, paddingBottom: 0, fontSize: 16 }}>{selectedTab === 0 ? "Post" : "Videos"}</Text>
              {selectedTab === 0 ? <TabOneScreen /> : <TabTwoScreen />}
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
