import { useState } from 'react'
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
} from 'react-native'
import { Redirect } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { MotiView } from 'moti'

import { colors } from '@/styles/colors'
import { Header } from '@/components/Header'
import { Button } from '@/components/button'
import { Credential } from '@/components/credential'
import { QRCode } from '@/components/qrcode'
import { useBadgeStore } from '@/store/badge-store'

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false)
  const badgeStore = useBadgeStore()

  async function handleShare() {
    try {
      if (badgeStore.data?.check_in_url) {
        await Share.share({
          message: badgeStore.data.check_in_url,
        })
      }
    } catch (error) {
      console.log(error)

      Alert.alert('Compatilhar', 'Não foi possível compartilhar')
    }
  }

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
    })

    if (!result.canceled) {
      console.log(result)
    } else {
      Alert.alert('You did not select any image.')
    }

    if (result.assets) {
      badgeStore.updateAvatar(result.assets[0].uri)
    }
  }

  if (!badgeStore.data?.check_in_url) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          image={badgeStore.data.image}
          onChangeAvatar={handleSelectImage}
          onExpandQRCode={() => setExpandQRCode(true)}
        />

        <MotiView
          from={{
            translateY: 0,
          }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do{' '}
          {badgeStore.data.event_title}!
        </Text>

        <Button title="Compartilhar" onPress={() => handleShare()} />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
          onPress={() => badgeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        statusBarTranslucent={true}
        visible={expandQRCode}
        animationType="slide"
      >
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <QRCode value="teste" size={300} />
            <Text className="font-body text-orange-500 text-sm text-center mt-10">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
