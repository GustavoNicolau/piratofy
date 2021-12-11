import { useRecoilState } from "recoil";
import { currentTrackIdState, IsPlayingState } from "../../atoms/songAtom";
import useSpotify from "../../hooks/useSpotify"
import useSongInfo from "../../hooks/useSongInfo"
import Song from "../songs/song";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { PauseIcon, ReplyIcon, SwitchHorizontalIcon, VolumeDownIcon, VolumeOffIcon } from "@heroicons/react/outline";
import { RewindIcon, PlayIcon, FastForwardIcon, VolumeUpIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";

function index() {

    const spotifyApi = useSpotify();

    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(IsPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();
    const fetchCurrentSong = async () => {
        if (!songInfo) {
            const data = await spotifyApi.getMyCurrentPlayingTrack();
            setCurrentIdTrack(data.body?.item?.id);

            const state = await spotifyApi.getMyCurrentPlaybackState()
            setIsPlaying(state.body?.is_playing)
        }
    }

    const handlePlayPause = async () => {
        const data = await spotifyApi.getMyCurrentPlaybackState();
        if (data.body?.is_playing) {
            spotifyApi.pause();
            setIsPlaying(false);
        } else {
            spotifyApi.play();
            setIsPlaying(true);
        }
    }
    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }

    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolmue(volume);
        }
    }, [volume]);

    const debouncedAdjustVolmue = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => { });
        }, 100),
        []
    )
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
                <RewindIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
                )}

                <FastForwardIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
                <ReplyIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeUpIcon className="w-4 h-4 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
                <input className="w-14 md:w-32 rounded-lg overflow-hidden appearance-none bg-gray-600" onChange={e => setVolume(Number(e.target.value))} type="range" value={volume} min={0} max={100} />

            </div>
        </div>
    )
}

export default index
