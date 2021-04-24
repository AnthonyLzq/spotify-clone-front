import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = React.useState(false)

  React.useEffect(() => setPlay(true), [trackUri])

  return (
    accessToken && (
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (!state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
      />
    )
  )
}

export default Player
