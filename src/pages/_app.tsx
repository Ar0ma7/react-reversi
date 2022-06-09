import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/modules'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
export default MyApp
