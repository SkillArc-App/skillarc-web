import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Page title */}
        {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
        <title>SkillArc</title>

        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Red Hat Display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* Supreme */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=supreme@501,2,800,400,401,200,100,300,101,301,500,201,801,1,701,700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
