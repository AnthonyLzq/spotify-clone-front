import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const useAuth = code => {
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(null)

  const getAuth = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_ROUTE}/login`,
        { code }
      )

      window.history.pushState({}, null, '/')

      const {
        data: {
          accessToken : at,
          refreshToken: rf,
          expiresIn   : ei
        }
      } = response

      setAccessToken(at)
      setRefreshToken(rf)
      setExpiresIn(ei)
    } catch (error) {
      console.error(error)
      window.location = '/'
    }
  }, [code])

  useEffect(() => { getAuth() }, [getAuth])

  const getRefresh = useCallback(() => {
    if (refreshToken && expiresIn) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_ROUTE}/refresh`,
            { refreshToken }
          )

          const {
            data: {
              accessToken : at,
              expiresIn   : ei
            }
          } = response

          console.log({ refreshToken, expiresIn })
          setAccessToken(at)
          setExpiresIn(ei)
        } catch (error) {
          console.error(error)
          window.location('/')
        }
      }, (expiresIn - 60) * 1000)

      return () => clearTimeout(interval)
    }
  }, [refreshToken, expiresIn])

  useEffect(() => { getRefresh() }, [getRefresh])

  return {
    accessToken
  }
}

export default useAuth
