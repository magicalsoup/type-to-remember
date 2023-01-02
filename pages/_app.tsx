import '../styles/globals.css'
import "../styles/raleway.css"
import "../styles/roboto-mono.css"
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
