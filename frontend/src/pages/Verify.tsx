import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Verify = () => {

    const [phonenumber] = useState<string>(localStorage.getItem('phonenumber') || '');
    const [code, setCode] = useState<string>('');
    const [isSent, setIsSent] = useState(false);

    const navigate = useNavigate();

    const handleSendCode = () => {
        axios.post('/api/send_verify', {phoneNumber: phonenumber}).then((res) => {
            if(res.data.msg == 'sent_verify') {
                setIsSent(true);
                return toast.success('Verification code was sent to your Phone. Please Verify the code.')
            }
        });
    }

    const handleVerifyCode = () => {
        axios.post('/api/check_verify', {phoneNumber: phonenumber, code: code}).then((res) => {
            if(res.data.msg == 'verify_success') {
                toast.success('Phone verified successfully! Please Login again.');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        });
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="max-w-[30rem] w-full h-full flex flex-col justify-center items-center relative p-4">
                <div className="w-full group mt-36">
                    <label className="text-sm font-medium text-white mb-1 block">{isSent ? 'Verification Code' : 'Your Phone Number'}</label>
                    <div className="flex items-center gap-2 bg-[#3e2d54] px-3 py-2 rounded-full group-focus-within:ring-1 group-focus-within:ring-purple-500 transition">
                        { isSent ? (
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {setCode(e.target.value)}}
                                placeholder="Verification Code"
                                className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={phonenumber}
                                placeholder="Your Phone Number"
                                className="flex-1 bg-transparent py-1 text-white placeholder-gray-400 focus:outline-none"
                            />
                        )
                        }
                    </div>
                </div>
                <button
                    className="w-full bg-[#e478ff] text-white font-semibold py-3 mt-36 rounded-full hover:bg-[#d55ee9] transition"
                    onClick={() => {isSent ? handleVerifyCode() : handleSendCode()}}
                >
                    {isSent ? 'Verify code' : 'Send code'}
                </button>
            </div>
        </div>
    )
}

export default Verify;