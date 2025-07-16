import { useState, useEffect } from 'react'
import './App.css'
import './gradients.css'
import { RANKS } from './constants.js'
import { clientId, code, redirectToAuthCodeFlow, getAccessToken, fetchProfile } from './auth.js'

const favSongs = [
  { id: 's1', title: "Let Down", artist: "Radiohead", rank: RANKS.TRANSCENDENT },
  { id: 's2', title: "the way things go", artist: "beabadoobee", rank: RANKS.BRONZE },
  { id: 's3', title: "The Adults Are Talking", artist: "The Strokes", rank: RANKS.GOLD }
];

const favArtists = [
  { id: 'a1', artist: "Radiohead", rank: RANKS.ETHEREAL },
  { id: 'a2', artist: "Lana Del Rey", rank: RANKS.SILVER },
  { id: 'a3', artist: "Taylor Swift", rank: RANKS.PLATINUM }
];

function Profile({ profile }) {
  console.log("Profile prop:", profile) // See what profile contains
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Akash's Profile</h1>

      {/*fav songs*/}
      <ul className='mb-4'>
        {favSongs.map((item, index) => (
          <li key={index} className="mb-2">
            <span className="font-semibold">{item.title}</span> — {item.artist} <span className={`${item.rank.color} ${item.rank.gradient} font-semibold text-gradient-base`}>[{item.rank.text}]</span>
          </li>
        ))}
      </ul>

      <hr className='mb-4' />

      {/*fav artists*/}
      <ul>
        {favArtists.map((item, index) => (
          <li key={index} className='mb-2' >
            <span className='font-semibold'>{item.artist}</span> <span className={`${item.rank.color} ${item.rank.gradient} font-semibold text-gradient-base`}>[{item.rank.text}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}



function TestBackend() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3000")
      .then(response => response.json())     
      .then(responseData => {                
        console.log('Data received:', responseData)  
        setData(responseData)              
        setLoading(false)
      })
      .catch(error => {
        console.error("error: ", error)
        setLoading(false)
      }) 
  }, [])

  return (
    <div className='pl-8 font-semibold'>
      <h1>Test api call</h1>
      {loading ? <p>loading...</p> : <p>{data.message}</p>}
  
    </div>
  )
}

function App() {
  const [profile, setProfile] = useState(null)
  return (
    <>
      <Profile profile = {profile}/>
      <TestBackend/>
    </>
  )
}
export default App
