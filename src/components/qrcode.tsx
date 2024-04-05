import QRCodeSvg from 'react-native-qrcode-svg'
import { colors } from '@/styles/colors'

type QRCodeProps = {
  value: string
  size: number
}

export function QRCode(props: QRCodeProps) {
  return (
    <QRCodeSvg 
      value={props.value}
      size={props.size}
      color={colors.white}
      backgroundColor='transparent'
    />
  )
}