import { Box, useTheme } from '@chakra-ui/react'
import { IconType } from 'react-icons'

const BadgeIcon = ({
  count,
  icon: Icon,
  onClick,
}: {
  count: number
  icon: IconType
  onClick?: () => void
}) => {
  const theme = useTheme()

  return (
    <Box onClick={onClick}>
      <Icon role='icon' size={'1rem'} color={theme.colors.gray[600]} />
      {count > 0 && <div className="notification-badge">{count}</div>}
    </Box>
  )
}

export default BadgeIcon
