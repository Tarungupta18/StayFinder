import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuest, setNumberOfGuesst] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        const response = await axios.post('/bookings', {
            checkIn, checkOut, numberOfGuest, name, phone,
            place: place._id,
            price: numberOfNights * place.price,
        });
        const bookingId = response.data._id; 
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
                    <div className="text-2xl flex gap-1 justify-center items-center">
                        Price: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mt-1.5 ml-1" viewBox="0 0 320 512"><path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z"/></svg>{place.price} / per night
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
            {numberOfNights > 0 && (
                <div className="py-3 px-4 border-t">
                    <lable>Your Full Name </lable>
                    <input type="text"
                        value={name}
                        onChange={ev => setName(ev.target.value)} />
                    <lable>Phone Number </lable>
                    <input type="tel"
                        value={phone}
                        onChange={ev => setPhone(ev.target.value)} />
                </div>
                )}
                    
            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> - {numberOfNights} Days, Total = [₹{numberOfNights*place.price}]</span>
                )}
            </button>
        </div>
    );
}