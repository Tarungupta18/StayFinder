import {useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }
  return (
    <div>
            <AccountNav />
            {subpage === 'profile' && (
              <div className="mt-24">
                <div className="flex justify-center items-center">
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                        <div className="text-3xl font-bold text-gray-800 mb-4">
                            Profile
                        </div>
                        <div className="text-center mb-6">
                            <div className="text-2xl font-semibold text-gray-700">
                                Logged in as <span className="text-blue-600 uppercase">{user.name}</span>
                            </div>
                            <div className="text-gray-500">({user.email})</div>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={logout} className="bg-indigo-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-indigo-700 transition duration-300">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>

  );
}