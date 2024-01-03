import { Box } from '@chakra-ui/react'
import { FaBell } from 'react-icons/fa6'
import BadgeIcon from './BadgeIcon.component'

const NotificationIcon = ({ count }: { count: number }) => {
  return (
    <Box cursor="pointer" className="notification-wrapper" px={'0rem'}>
      <BadgeIcon Icon={FaBell} count={count} />
    </Box>
  )
}

export default NotificationIcon
