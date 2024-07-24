import { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SkillArc: Tap Into Talent',
  description: 'SkillArc your career and hiring partner in Columbus Ohio.',
  other: { "google-site-verification": "4CR5olDyg3hhoOqnO1iacmAxcEPlIoqPD1LRrjKTUeo" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
