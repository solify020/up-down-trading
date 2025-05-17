import { useState } from "react";
import Logo from "../../assets/logo.png"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';


const RECAPTCHA_SITE_KEY = '6LdN8DwrAAAAAIMnpR-t8E-tHBxXY6AlbDPI6vCl';


const SignUp = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [isAgree, setIsAgree] = useState(false);


    const handleSignUp = async () => {
        if (password != rePassword) return toast.error('Confirm Password Failed!');
        if (!isAgree) return toast.error('Please agree our privacy policy and term of service');
        axios.post('/api/signup', { phoneNumber, password, username, captchaToken }).then((res) => {
            if (res.data.message == 'User created') {
                toast.success('SignUp success!');
                return setTimeout(() => {
                    navigate('/');
                }, 1000)
            }
        }).catch((err) => {
            if (err.response.data.error == 'captcha_error') return toast.error('reCAPTCHA Error!')
        })
    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="max-w-[30rem] w-full h-full flex justify-center items-center relative p-4">
                <h1 className="text-white text-md font-bold absolute top-1">Sign Up</h1>
                <div className="flex flex-col w-full justify-center items-start">
                    <div className="w-full gap-6">
                        <img src={Logo} alt="" className="w-22 h-22" />
                        <h1 className="text-white text-3xl font-bold">Sign Up</h1>
                    </div>

                    <div className="w-full flex gap-4 flex-col mt-6">
                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">User Name</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Phone Number</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => { setPhoneNumber(e.target.value) }}
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
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Confirm Password</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={rePassword}
                                    onChange={(e) => { setRePassword(e.target.value) }}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Referral Code (Optional)</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="text"
                                    placeholder="Referal Code"
                                    value={referralCode}
                                    onChange={(e) => { setReferralCode(e.target.value) }}
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* <div className="w-full group">
                            <label className="text-sm font-medium text-white mb-1 block">Re-enter Password</label>
                            <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                                <input
                                    type="password"
                                    placeholder="Enter password again"
                                    className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.7 2.36-2.178 4.347-4.14 5.663M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div> */}

                        <div className="flex flex-col justify-center items-start text-sm text-gray-300 gap-2">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-purple-500 bg-gray-100 border-gray-300 rounded-sm"
                                    checked={isAgree}
                                    onChange={(e => {setIsAgree(e.target.checked)})}
                                />
                                <label htmlFor="default-checkbox" className="ms-2 text-base text-gray-300 cursor-pointer">I agree with Privacy Policy and Service Terms</label>
                            </div>
                            {/* <div className="flex">
                                <a href="#" className="underline">User Agreement</a>
                                <p>&nbsp;&&nbsp;</p>
                                <a href="#" className="underline">Privacy clause</a>
                            </div> */}
                        </div>
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token: any) => setCaptchaToken(token)}
                        />
                        <button className="w-full bg-[#e478ff] text-white font-semibold py-3 rounded-full hover:bg-[#d55ee9] transition" onClick={handleSignUp}>
                            Sign Up
                        </button>

                        <p className="text-center text-sm text-gray-300 mt-4">
                            <a href="/" className="text-[#e478ff] font-medium hover:underline">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;