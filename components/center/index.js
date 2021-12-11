import { signOut, useSession } from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from '../../atoms/playlistAtom';
import useSpotify from "../../hooks/useSpotify"
import Songs from '../songs'

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]
function index() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [loading, setLoading] = useState(false)
    useEffect(() => {

        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(async () => {
        try {
            setLoading(true)
            const data = await spotifyApi.getPlaylist(playlistId);
            setPlaylist(data.body)
            setLoading(false)
        } catch (err) {
            alert("Deu erro aqui, manda DM pro @thenicolauuu arrumar essa porra")
        }

    }, [spotifyApi, playlistId])

    console.log(playlist)
    return (

        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            {loading ? (<div className="flex bg-black h-full justify-center items-center text-white "> <h1>Carregando....</h1></div>) : null}
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-gray-900 text-white space-x-3 opacity-90 
                hover:opacity-80 cursor-pointer rounded-full p-1 pr-2" onClick={signOut}>
                    <img className="rounded-full w-10 h-10" src={session?.user?.image} alt="" />

                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color}
            h-80 text-white p-8` }>

                <img src={playlist?.images?.[0]?.url} className="h-44 w-44 shadow-2xl" alt="" />
                <div>
                    <p>PLAYLIST - criado por {playlist?.owner?.display_name}</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                        {playlist?.name}
                    </h1>
                </div>
            </section>
            <Songs />
        </div>


    )
}

export default index
