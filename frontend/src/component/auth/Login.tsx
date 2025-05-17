import { useState } from "react";
import Logo from "../../assets/logo.png"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';
import axios from "axios";

const RECAPTCHA_SITE_KEY = '6LdN8DwrAAAAAIMnpR-t8E-tHBxXY6AlbDPI6vCl';

const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [captchaToken, setCaptchaToken] = useState<string>('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (phoneNumber === "" || password === "") {
            toast.error("Please enter phone number and password");
            return;
        } else {
            await axios.post('/api/signin', {
                phoneNumber,
                password,
                captchaToken
            }).then((res) => {
                if (res.data.msg == 'not_verified') {
                    localStorage.setItem('phonenumber', phoneNumber);
                    return navigate('/verify');
                }
                else if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('referralCode', phoneNumber);
                    toast.success("Login successful!");
                    navigate("/home");
                } else {
                    toast.error("Login Failed!");
                }
            }).catch((err) => {
                if (err.response.data.error == 'captcha_error') return toast.error('Please verify reCAPTCHA!');
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
                            <label className="text-sm font-medium text-white mb-1 block">Phone Number</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
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
                            </div>
                        </div>
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token: any) => setCaptchaToken(token)}
                        />
                        <button className="w-full bg-[#e478ff] text-white font-semibold py-3 rounded-full hover:bg-[#d55ee9] transition" onClick={handleLogin}>
                            Log In
                        </button>
                        <p className="text-center text-sm text-gray-300 mt-4">
                            <a href="/signup" className="text-[#e478ff] font-medium hover:underline">Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;