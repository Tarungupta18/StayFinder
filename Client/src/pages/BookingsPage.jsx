import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import TotalPrice from "../TotalPrice";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data);
        });
    }, []);
    return (
        <div>
            <AccountNav />
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 mb-3 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-48">
                            <PlaceImg place={booking.place}/>
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl font-bold">{booking.place.title }</h2>
                            <BookingDates booking={booking} />
                            <TotalPrice booking={booking} />
                        </div>
                        
                    </Link>
                ))}
            </div>
        </div>
    );
}