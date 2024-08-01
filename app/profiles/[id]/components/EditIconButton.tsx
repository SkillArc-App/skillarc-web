import { EditIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import Link from 'next/link'

export default function EditIconButton({ href }: { href: string }) {
  return (
    <Button
      variant={'icon'}
      as={Link}
      href={href}
      color="greyscale.600"
      aria-label="Edit Profile"
    >
      <EditIcon />
    </Button>
  )
}
