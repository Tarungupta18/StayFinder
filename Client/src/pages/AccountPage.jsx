import { Navigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import axios from "axios";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);

    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user) {
        return <Navigate to={'/login'} />
    }

    function linkClasses(type) {
        let classes = 'p-2 px-6';
        if (type === subpage) {
            classes += ' bg-primary text-white rounded-full';
        }
        return classes;
    }

    if (redirect && !user && !redirect) {
        return <Navigate to={redirect}/>
    }

    return (
        <div>
            <nav className="w-full justify-center flex mt-8 gap-2 mb-8">
                <Link className={linkClasses('profile')} to={'/account/profile'}>My profile</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'}>My bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'}>My accommodations</Link>
            </nav>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>

            )}
        </div>
    );
}
