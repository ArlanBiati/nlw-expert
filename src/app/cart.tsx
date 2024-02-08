import { useState } from 'react'
import { Alert, Linking, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { ProductCartProps, useCartStore } from '@/store/cart-store'

import { FormatCurrency } from '@/utils/functions/format-currency'

import { Input } from '@/components/input'
import { Header } from '@/components/header'
import { Button } from '@/components/button'
import { Product } from '@/components/product'
import { LinkButton } from '@/components/link-button'

const PHONE_NUMBER = '5517991232222'

export default function Cart() {
  const navigation = useNavigation()
  const { products, remove, clear } = useCartStore()

  const [address, setAddress] = useState('')

  const total = FormatCurrency(
    products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  )

  function handleRemoveProduct(product: ProductCartProps) {
    Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`, [
      {
        text: 'Cancelar',
      },
      {
        text: 'Remover',
        onPress: () => remove(product.id),
      },
    ])
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert('Pedido', 'Informe os dados da entrega.')
    }

    const productsOrder = products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join('')

    const message = `
      NOVO PEDIDO
      \n Entregar em: ${address}

      ${productsOrder}

      \n Valor total: ${total}
    `

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    )

    clear()
    navigation.goBack()
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5 flex-1">
          {products.length > 0 ? (
            <View className="border-b border-slate-700">
              {products.map((product) => (
                <Product
                  key={product.id}
                  data={product}
                  onPress={() => handleRemoveProduct(product)}
                />
              ))}
            </View>
          ) : (
            <Text className="font-body text-slate-400 text-center my-8">
              Seu carrinho está vazio
            </Text>
          )}

          <View className="flex-row gap-2 items-center mb-4 mt-5">
            <Text className="text-white text-xl font-subtitle">Total:</Text>

            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>

          <Input
            placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
            onChangeText={setAddress}
            blurOnSubmit
            returnKeyType="next"
            onSubmitEditing={handleOrder}
          />
        </View>
      </KeyboardAwareScrollView>

      <View className="gap-5 p-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  )
}
