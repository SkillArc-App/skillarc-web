import { Box } from '@chakra-ui/react'
import { FaBell } from 'react-icons/fa6'
import BadgeIcon from './BadgeIcon'

const NotificationIcon = ({ count }: { count: number }) => {
  return (
    <Box cursor="pointer" px={'0rem'}>
      <BadgeIcon icon={FaBell} count={count} />
    </Box>
  )
}

export default NotificationIcon
