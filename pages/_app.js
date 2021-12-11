import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import 'tailwindcss/tailwind.css'
import './global.css'
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
