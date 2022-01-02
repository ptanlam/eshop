import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const { loginWithPopup } = useAuth0();
  const history = useHistory();

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100 py-5">
      <div className="relative max-w-xs md:max-w-sm lg:max-w-md w-full">
        <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
        <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <div className="relative rounded-3xl p-4 bg-gray-100 shadow-md">
          <button
            className="bg-blue-500 w-full py-3 rounded-xl text-sm md:text-base lg:text-xl  text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
            onClick={() =>
              loginWithPopup().then(() => history.push("/admin/categories"))
            }
          >
            Login with Auth0
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
