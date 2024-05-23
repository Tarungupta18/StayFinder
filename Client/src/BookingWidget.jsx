import { useState } from "react";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuest, setNumberOfGuesst] = useState(1);
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
                    <div className="text-2xl text-center">
                        Price: ${place.price} / per night
                    </div>
                    <div className="border rounded-2xl mt-4 ">
                        <div className="flex justify-evenly">
                            <div className="py-3 px-4">
                                <lable>Check in: </lable>
                                <input type="date"
                                    value={checkIn}
                                    onChange={ev => setCheckIn(ev.target.value)} />
                            </div>
                            <div className="py-3 px-4 border-l pl-14 justify-content">
                                <lable>Check out: </lable>
                                <input type="date"
                                    value={checkOut}
                                    onChange={ev => setCheckOut(ev.target.value)} />
                            </div>
                        </div>
                        <div className="py-3 px-4 border-t">
                                <lable>Number of guests: </lable>
                                <input type="number"
                                    value={numberOfGuest}
                                    onChange={ev => setNumberOfGuesst(ev.target.value)} />
                            </div>
                    </div>
                    
                    <button className="primary mt-4">Book this place</button>
                </div>
    );
}