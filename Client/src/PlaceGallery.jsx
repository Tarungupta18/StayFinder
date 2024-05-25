import {useState} from "react";
// import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen flex flex-col">
                <div className="grid gap-4 p-8 justify-center bg-black">
                    <div>
                        <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 rounded-2xl py-2 px-4 shadow shadow-black bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div className="flex justify-center">
                            <img src={"http://localhost:4000/uploads/"+photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative ">
            <div className="grid grid-cols-3 gap-2 rounded-3xl overflow-hidden">
                <div className="col-span-2 row-span-2">
                    {place.photos?.[0] && (
                        <img onClick={() => setShowAllPhotos(true)} src={"http://localhost:4000/uploads/" + place.photos[0]} alt="" className="cursor-pointer object-cover w-full h-full" />
                    )}
                </div>
                <div className="grid grid-rows-2 gap-2">
                    {place.photos?.[1] && (
                        <div className="row-span-1">
                            <img onClick={() => setShowAllPhotos(true)} src={"http://localhost:4000/uploads/" + place.photos[1]} alt="" className="cursor-pointer object-cover w-full h-full" />
                        </div>
                    )}
                    {place.photos?.[2] && (
                        <div className="row-span-1 -mb-2 ">
                            <img onClick={() => setShowAllPhotos(true)} src={"http://localhost:4000/uploads/" + place.photos[2]} alt="" className="cursor-pointer object-cover w-full h-full " />
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75L7.409 10.591a2.25 2.25 0 013.182 0L15.75 15.75m-1.5-1.5L15.659 12.84a2.25 2.25 0 013.182 0l2.909 2.909M2.25 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12A1.5 1.5 0 003.75 21Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z" />
                </svg>
                Show more photos
            </button>
        </div>
    );
}