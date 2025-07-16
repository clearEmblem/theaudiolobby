import { useState, useEffect } from 'react'
import './App.css'
import './gradients.css'
import { RANKS } from './constants.js'
// import { clientId, code, redirectToAuthCodeFlow, getAccessToken, fetchProfile } from './auth.js'
const TOKEN = "BQCPr_1jef4KcJMYVNrMrjGsu-RQeR4pGZ1zn49Ur6o_eZ9wPwySjX0mQ00ECDgwYfn1CMk1VBjN0DH-A7hkPIzKAv48cwR4c5-PgIZ5errrPlYbku3oTTzb5kGtRnjMjtyK2eARQYQ"
const TSWIFT = "06HL4z0CvFAxyc27GXpf02"
const ARTIST = {
  name: "Travis Scott",
  id: "0Y5tJX1MQlPlqiwlOH1tJY"
}
// https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY?si=90f2e03d0729415d
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

function GetArtistButton({ TOKEN, ARTIST }) {
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      })

      if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(`HTTP error. Status: ${response.status} - ${errorBody.error.message || `Unkown error`}`)
      }

      const data = await response.json()
      setData(data)
    }
    catch (error) {
      console.error("error: ", { error })
    }

  }

  return (
    <div className=' pt-8 text-center'>
      <button className="text-center" onClick={fetchData}> {ARTIST.name}'s Stats</button>
      <div>
       {data &&
       <>
          <ul className='pt-4'>
            <li>Name - {data.name}</li>
            <li>Follower count - {data.followers.total}</li>
            <li>Genre - {data.genres[0]}</li>
          </ul>

          <img 
          className="w-32 h-32 object-cover rounded-full mx-auto mt-4"
          alt="artist art" 
          src={data.images[0].url}
          />       
       </>

        }     
      </div>


    </div>
  )

}

function Profile({ profile }) {
  console.log("Profile prop:", profile) // See what profile contains
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Akash's Profile</h1>

      {/*fav songs*/}
      <ul className='mb-4 text-center'>
        {favSongs.map((item, index) => (
          <li key={index} className="mb-2">
            <span className="font-semibold">{item.title}</span> — {item.artist} <span className={`${item.rank.color} ${item.rank.gradient} font-semibold text-gradient-base`}>[{item.rank.text}]</span>
          </li>
        ))}
      </ul>

      <hr className='mb-4' />

      {/*fav artists*/}
      <ul className='text-center'>
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
      <Profile profile={profile} />
      {/*<TestBackend />*/}
      <GetArtistButton TOKEN={TOKEN} ARTIST={ARTIST} />
    </>
  )
}
export default App
