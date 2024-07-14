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
                {bookings?.length > 0 ? (
                    bookings.map(booking => (
                        <Link
                            to={`/account/bookings/${booking._id}`}
                            className="flex gap-4 mb-3 bg-gray-200 rounded-2xl overflow-hidden"
                            key={booking._id}
                        >
                            <div className="w-48">
                                {booking.place && <PlaceImg className="w-full h-full" place={booking.place} />}
                            </div>
                            <div className="py-3 pr-3 grow">
                                {booking.place ? (
                                    <>
                                        <h2 className="text-xl font-bold">{booking.place.title}</h2>
                                        <BookingDates booking={booking} />
                                        <TotalPrice booking={booking} />
                                    </>
                                ) : (
                                    <h2 className="text-xl font-bold -mx-20">Enjoy Place</h2>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        No bookings found
                    </div>
                )}
            </div>
        </div>
    );
}