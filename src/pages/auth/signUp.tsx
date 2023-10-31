import { LoadingPage } from '@/frontend/components/Loading'
import type { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'

export default function SignIn() {
  useEffect(() => {})

  return <LoadingPage />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {}
