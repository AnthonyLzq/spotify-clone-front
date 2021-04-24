import React from 'react'

const TrackSearchResult = ({
  uri,
  artist,
  title,
  albumUrl,
  albumName,
  chooseTrack
}) => {
  const handlePlay = () => chooseTrack({ uri, artist, title })

  return (
    <div
      className='d-flex m-2 align-items-center'
      style={{ cursor: 'pointer' }}
      onClick={handlePlay}
    >
      <img
        alt={albumName}
        src={albumUrl}
        style={{
          borderRadius: '50%',
          maxHeight   : '64px',
          maxWidth    : '64px',
          objectFit   : 'cover'
        }}
      />
      <div className='ml-3'>
        <div>{title}</div>
        <div className='text-muted'>{artist}</div>
      </div>
    </div>
  )
}

export default TrackSearchResult
