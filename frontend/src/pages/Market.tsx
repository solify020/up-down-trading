import axios from "axios";
import { useEffect, useState } from "react";
import Btc from '../assets/imgs/btc.png';
import Eth from '../assets/imgs/eth.png';
import Sol from '../assets/imgs/sol.png';
import Xrp from '../assets/imgs/xrp.png';
import Ltc from '../assets/imgs/ltc.png';

const Market = () => {

    const [cryptoPrice, setCryptoPrice] = useState({
        btc: 0,
        eth: 0,
        sol: 0,
        xrp: 0,
        ltc: 0
    });

    useEffect(() => {
        setInterval(() => {
            axios.get('/api/all_price').then((res) => {
                setCryptoPrice(res.data.cryptoPrice);
            });
        }, 2000)
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#36164e] from-gray-100 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
            <h1 className="mt-8 text-3xl text-white">Crypto Market</h1>
            <div className="w-[95%] h-24 bg-[#7700ff] rounded-xl mt-6 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Btc} className="rounded-full w-12" />
                    <span className="text-2xl text-white">BTC</span>
                </div>
                <div className="text-white text-2xl">
                    ${cryptoPrice.btc}
                </div>
            </div>
            <div className="w-[95%] h-24 bg-[#7700ff] rounded-xl mt-6 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Eth} className="rounded-full w-12" />
                    <span className="text-2xl text-white">ETH</span>
                </div>
                <div className="text-white text-2xl">
                    ${cryptoPrice.eth}
                </div>
            </div>
            <div className="w-[95%] h-24 bg-[#7700ff] rounded-xl mt-6 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Sol} className="rounded-full w-12" />
                    <span className="text-2xl text-white">SOL</span>
                </div>
                <div className="text-white text-2xl">
                    ${cryptoPrice.sol}
                </div>
            </div>
            <div className="w-[95%] h-24 bg-[#7700ff] rounded-xl mt-6 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Xrp} className="rounded-full w-12" />
                    <span className="text-2xl text-white">XRP</span>
                </div>
                <div className="text-white text-2xl">
                    ${cryptoPrice.xrp}
                </div>
            </div>
            <div className="w-[95%] h-24 bg-[#7700ff] rounded-xl mt-6 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Ltc} className="rounded-full w-12" />
                    <span className="text-2xl text-white">LTC</span>
                </div>
                <div className="text-white text-2xl">
                    ${cryptoPrice.ltc}
                </div>
            </div>
        </div>
    );
}

export default Market;