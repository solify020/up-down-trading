import { useNavigate } from "react-router-dom";
import Trading from '../assets/imgs/trading.png';
import Updown from '../assets/imgs/updown.png';

const Home = () => {

    const navigate = useNavigate();



    const toBet = () => {
        navigate('/bet');
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#36164e] from-gray-100 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
            <div className="w-[80%] bg-[#26063e] h-54 mt-12 rounded-xl flex flex-col justify-center items-center">
                <div className="text-white text-xl">Bet Your Prediction!</div>
                <img src={Trading} className="w-[95%] rounded-xl" />
            </div>
            <div className="mt-12 flex flex-col justify-center items-center">
                <h1 className="text-2xl text-white">Bet Your Prediction</h1>
                <h1 className="text-2xl text-white">Win the Prize</h1>
            </div>
            <img src={Updown} />
            <button
                className="text-white w-48 h-12 bg-[#16062e] rounded-full"
                onClick={toBet}
            >
                Bet Now
            </button>
            <div className="mt-12 flex flex-col justify-center items-center">
                <h1 className="text-2xl text-white">Your Referral Code</h1>
                <h1 className="text-2xl text-white">{localStorage.getItem('referralCode')}</h1>
            </div>
        </div>
    );
}

export default Home;