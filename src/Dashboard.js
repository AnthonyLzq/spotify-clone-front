import React from 'react'
import axios from 'axios'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import useAuth from './hooks/useAuth'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID
})

const Dashboard = ({ code }) => {
  const { accessToken } = useAuth(code)
  const [search, setSearch] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  const [playingTrack, setPlayingTrack] = React.useState()
  const [lyrics, setLyrics] = React.useState('')

  const chooseTrack = track => {
    setPlayingTrack(track)
    setSearch('')
    setSearchResults([])
    setLyrics('')
  }

  React.useEffect(() => {
    if (accessToken) spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  const fetchTracks = React.useCallback(async () => {
    try {
      const response = await spotifyApi.searchTracks(search)
      const {
        body: {
          tracks: { items }
        }
      } = response

      setSearchResults(
        items.map(track => {
          const {
            artists,
            name,
            uri,
            album
          } = track
          const smallestAlbumImage = album.images.reduce((smallest, image) => {
            if (smallest.height < image.height) return smallest

            return image
          })['url']

          return {
            artist   : artists[0].name,
            title    : name,
            uri      : uri,
            albumUrl : smallestAlbumImage,
            albumName: album.name
          }
        })
      )
    } catch (error) {
      console.error(error)
    }
  }, [search])

  React.useEffect(() => {
    if (search && accessToken) {
      const timeout = setTimeout(() => fetchTracks(), 300)

      return () => clearTimeout(timeout)
    }
  }, [search, accessToken, fetchTracks])

  const fetchLyrics = React.useCallback(async () => {
    if (playingTrack) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ROUTE}/lyrics`,
          { 
            params: {
              artist: playingTrack.artist,
              track: playingTrack.title
            }
          }
        )
        const { data: { lyrics: resLyrics } } = response
        setLyrics(resLyrics)
      } catch (error) {
        console.error(error)
      }
    }
  }, [playingTrack])

  React.useEffect(() => { fetchLyrics() }, [fetchLyrics])

  return (
    <Container className='d-flex flex-column py-2' style={{ height: '100vh' }}>
      <Form.Control
        placeholder='Search Songs/Artists'
        onChange={({ target }) => setSearch(target.value)}
        type='search'
        value={search}
      />
      <div className='flex-grow-1 my-2' style={{ overflowY: 'auto' }}>
        {searchResults.length > 0 && searchResults.map(track => (
          <TrackSearchResult
            {...track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {playingTrack && (
          <div className='text-center' style={{ whiteSpace: 'pre' }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )
}

export default Dashboard
