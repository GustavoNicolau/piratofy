import { HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon, UserIcon } from '@heroicons/react/outline'
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../../atoms/playlistAtom';
import useSpotify from "../../hooks/useSpotify"

function index() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    useEffect(async () => {
        if (spotifyApi.getAccessToken()) {
            const data = await spotifyApi.getUserPlaylists();
            setPlaylists(data.body.items)
        }
    }, [session, spotifyApi])

    return (
        <div className="text-gray-500 p-5 text-xs lg:text-sm sm:max-w-[12rem] 
        lg:max-w-[15rem] border-r border-gray-900 hidden md:inline-flex
        overflow-y-scroll scrollbar-hide h-screen pb-36">
            <div className="space-y-4">
                <button className="flex items-center space-x-2 hover:text-white"
                    onClick={() => signOut()}>

                    <p>Logout</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Página Inicial</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Buscar</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Sua Biblioteca</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" />
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Criar playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5" />
                    <p>Músicas Curtidas</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5" />
                    <p>Seus podcast</p>
                </button>

                <button className="flex items-center space-x-2 hover:text-white">
                    <UserIcon className="h-5 w-5" />
                    <p>Recomendação do pai</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" />
                {playlists.map((playlist) => (
                    <p key={playlist.id} onClick={() => { setPlaylistId(playlist.id) }} className="cursor-pointer hover:text-white">
                        {playlist.name}
                    </p>
                ))}


            </div>
        </div>
    )
}

export default index
