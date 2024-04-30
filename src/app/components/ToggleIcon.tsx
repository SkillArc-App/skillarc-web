import { Icon } from '@chakra-ui/react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'

const ToggleIcon = ({
  onClick,
  isBookmarked,
}: {
  onClick?: (active: boolean) => void
  isBookmarked: boolean
}) => {
  const handleClick = (event: React.BaseSyntheticEvent) => {
    event.stopPropagation()

    if (onClick) onClick(!isBookmarked)
  }

  return <Icon as={isBookmarked ? FaBookmark : FaRegBookmark} boxSize={6} onClick={handleClick} />
}

export default ToggleIcon
