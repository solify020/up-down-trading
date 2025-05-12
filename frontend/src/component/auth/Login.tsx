import { useState } from "react";
import Logo from "../../assets/logo.png"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (phoneNumber === "" || password === "") {
            toast.error("Please enter phone number and password");
            return;
        } else {
            await axios.post('/api/signin', {
                username: phoneNumber,
                password: password
            }).then((res) => {
                if(res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    toast.success("Login successful!");
                    navigate("/home");
                } else {
                    toast.error("Login Failed!");
                }
            })
        }
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="max-w-[30rem] w-full h-full flex justify-center items-center relative p-4">
                <h1 className="text-white text-md font-bold absolute top-1">Log In</h1>
                <div className="flex flex-col w-full justify-center items-start">
                    <div className="w-full gap-6">
                        <img src={Logo} alt="" className="w-22 h-22" />
                        <h1 className="text-white text-3xl font-bold">Welcome To Login</h1>
                    </div>

                    <div className="w-full flex gap-4 flex-col mt-6">
                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Username</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Password</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.7 2.36-2.178 4.347-4.14 5.663M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-[#e478ff] text-white font-semibold py-3 rounded-full hover:bg-[#d55ee9] transition" onClick={handleLogin}>
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;