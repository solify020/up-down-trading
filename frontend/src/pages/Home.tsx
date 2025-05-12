import { DockIcon, History, LineChart, ShieldQuestionIcon } from "lucide-react"
import BTC from "../assets/icon/btc.png"
import USDT from "../assets/icon/usdt.png"
import { useEffect, useState } from "react";
import TradingViewWidget from "../component/chart";
import NoData from "../assets/icon/nodata.png"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {

    // const [isBetted, setIsBetted] = useState(false);
    const [priceStamp, setPriceStamp] = useState(0);
    const [isShowBuyUp, setIsShowBuyUp] = useState<boolean>(false);
    const [isShowBuyDown, setIsShowBuyDown] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [priceUsd, setPriceUsd] = useState(0);
    const [upWinPrize, setUpWinPrize] = useState(0);
    const [downWinPrize, setDownWinPrize] = useState(0);
    const [betType, setBetType] = useState('up');

    const [upBetAmount, setUpBetAmount] = useState(0);
    const [upPeriod, setUpPeriod] = useState(60);
    const [upCurrency] = useState('BTC');

    const [downBetAmount, setDownBetAmount] = useState(0);
    const [downPeriod, setDownPeriod] = useState(60);
    const [downCurrency] = useState('BTC');

    // useEffect(() => {
    //     const timedown = () => {
    //         if (remainingTime == 0) return;
    //         const countdown = setInterval(() => {
    //             setRemainingTime(remainingTime - 1);
    //             if (remainingTime == 0) clearInterval(countdown)
    //         }, 1000);
    //     }
    //     timedown();
    // }, [])

    useEffect(() => {
        if (remainingTime === 0) return;
        const countdown = setInterval(() => {
            setRemainingTime(time => {
                if (time <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [remainingTime]);

    const handleBuyUp = async () => {
        axios.post('/api/bet', {
            betType,
            betAmount: upBetAmount,
            period: upPeriod,
            currency: upCurrency
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data.msg == 'already betted') return toast.error('Already Betted. Please wait.');
            if (res.data.error == 'Invalid or expired token') return navigate('/');
            setIsShowBuyDown(false);
            setIsShowBuyUp(false);
            setRemainingTime(res.data.bet.period);
            setPriceStamp(res.data.bet.pricestamp);
            console.log(res.data.bet.period);

            const countdown = setInterval(() => {
                setRemainingTime(time => {
                    if (time <= 1) {
                        clearInterval(countdown);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
            setTimeout(() => {
                axios.post('/api/check_bet', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    if (res.data.msg == 'win bet') {
                        // setIsBetted(false);
                        return toast.success("You won the bet! You got x1.9");
                    } else {
                        // setIsBetted(false);
                        return toast.error("You lost the bet! Please place bet again.");
                    }
                })
            }, upPeriod * 1000)
        });
    }

    const handleBuyDown = async () => {
        axios.post('/api/bet', {
            betType,
            betAmount: downBetAmount,
            period: downPeriod,
            currency: downCurrency
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data.msg == 'already betted') return toast.error('Already Betted. Please wait.');
            if (res.data.error == 'Invalid or expired token') return navigate('/');
            setIsShowBuyDown(false);
            setIsShowBuyUp(false);
            setRemainingTime(res.data.bet.period);
            setPriceStamp(res.data.bet.pricestamp);

            const countdown = setInterval(() => {
                setRemainingTime(time => {
                    if (time <= 1) {
                        clearInterval(countdown);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
            setTimeout(() => {
                axios.post('/api/check_bet', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    if (res.data.msg == 'win bet') {
                        // setIsBetted(false);
                        return toast.success("You won the bet! You got x1.9");
                    } else {
                        // setIsBetted(false);
                        return toast.error("You lost the bet! Please place bet again.");
                    }
                })
            }, res.data.bet.period * 1000)
        });
    }

    const navigate = useNavigate();

    useEffect(() => {
        setUpWinPrize(upBetAmount * 1.9)
    }, [upBetAmount])

    useEffect(() => {
        setDownWinPrize(downBetAmount * 1.9)
    }, [downBetAmount])

    useEffect(() => {
        setInterval(() => {
            const fetchBtcPrice = async () => {
                const btcPrice = (await axios.get('/api/btc_price')).data.btc;
                setPriceUsd(btcPrice);
            }
            fetchBtcPrice();
        }, 5000)
    }, [])

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/');
    }, [])

    useEffect(() => {
        const getBet = async () => {
            const bet = (await axios.get('/api/get_bet', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })).data;
            if (bet.msg !== 'waiting') toast.error("Please place Bet!");
            else {
                setPriceStamp(bet.bet.pricestamp);
                setRemainingTime(Number((bet.bet.period - (Date.now() - bet.bet.timestamp) / 1000).toFixed(0)));
                // setIsBetted(true);

                const time = Date.now() - bet.bet.timestamp;
                setTimeout(() => {
                        axios.post('/api/check_bet', undefined, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => {
                            if (res.data.msg == 'win bet') {
                                // setIsBetted(false);
                                return toast.success("You won the bet! You got x1.9");
                            } else {
                                // setIsBetted(false);
                                return toast.error("You lost the bet! Please place bet again.");
                            }
                        });
                }, time)
            }
        }
        getBet();
    }, [])

    return (
        <div className="w-full h-full relativepy-2">
            <div className="w-full h-[95%] flex flex-col overflow-y-auto px-6 overflow-hidden">
                <h1 className="text-white font-bold text-center text-lg">BTC/USDT</h1>

                <div className="w-full flex justify-between items-center mt-5">
                    <div className="flex gap-2">
                        <div className="relative">
                            <img src={BTC} alt="" className="w-7 absolute top-3 -left-2 border-2 border-[#58009f] rounded-full" />
                            <img src={USDT} alt="" className="w-7 border-2 border-[#58009f] rounded-full" />
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-md">BTCUSDT</span>
                            <span className="text-xs">BTC/USDT</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="border border-gray-50/30 p-1 rounded-md text-white"><ShieldQuestionIcon size={15} /></button>
                        <button className="border border-gray-50/30 p-1 rounded-md text-white"><LineChart size={15} /></button>
                    </div>
                </div>

                <div className="w-full flex mt-4 gap-4 items-end">
                    <h1 className="text-white text-3xl font-medium">${priceUsd}</h1>
                </div>
                <div className="w-full flex mt-4 gap-4 items-end text-white">
                    <span>Remaining Time: {remainingTime}s</span>
                </div>
                <div className="w-full flex mt-4 gap-4 items-end text-white">
                    <span>You betted at: ${priceStamp}</span>
                </div>

                <div className="mt-4">
                    <TradingViewWidget />
                </div>

                <div className="w-full mt-4">
                    <div className="w-full flex justify-between">
                        <h1 className="text-white font-bold text-lg">Position Details</h1>
                        <DockIcon className="text-white" />
                    </div>

                    <div className="w-full h-64 flex flex-col justify-center items-center bg-transparent">
                        <img src={NoData} alt="" className="w-50" />
                        <span className="text-white">No Records</span>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-14 left-0 right-0 w-full h-20 flex justify-center items-center px-4 gap-2">
                <button onClick={() => { setIsShowBuyUp(true); setBetType('up') }} className="w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-full hover:from-emerald-600 hover:to-green-500 transition shadow-md">
                    Buy Up x1.9
                </button>
                <button onClick={() => { setIsShowBuyDown(true); setBetType('down') }} className="w-1/2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-3 rounded-full hover:from-pink-600 hover:to-red-500 transition shadow-md">
                    Buy Down x1.9
                </button>
            </div>

            <div className={`w-full h-screen fixed top-0 flex justify-center items-end z-50 ${isShowBuyDown ? "flex" : "hidden"}`}>
                <div className="w-full flex flex-col justify-center items-center bg-[#3c2d51] px-5">
                    <div className="w-full relative flex justify-center items-center">
                        <h1 className="text-white text-center font-bold text-lg">Futures</h1>
                        <span className="right-4 text-white absolute" onClick={() => setIsShowBuyDown(false)}>X</span>
                    </div>

                    <div className="w-full flex gap-2">
                        <div className="relative">
                            <img src={BTC} alt="" className="w-7 absolute top-3 -left-2 border-2 border-[#58009f9e] rounded-full" />
                            <img src={USDT} alt="" className="w-7 border-2 border-[#58009f9e] rounded-full" />
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-md">BTCUSDT</span>
                            <span className="text-xs">BTC/USDT</span>
                        </div>
                    </div>

                    <div className="w-full flex mt-2 gap-4 items-end">
                        <h1 className="text-white text-[27px] font-medium">${priceUsd}</h1>
                    </div>

                    <div className="w-full flex justify-center items-center">
                        <div className="w-1/2 flex flex-col justify-center items-center">
                            <History className="w-4 text-white" />
                            <span className="text-xs text-white">{Date()}</span>
                        </div>
                    </div>

                    <div className="w-full flex px-2 bg-[#2b1c40] mt-2 rounded-md py-2 justify-between items-center">
                        <span className="text-white text-xs">Betting Type</span>
                        <span className="text-red-500 text-sm">Buy Down</span>
                    </div>

                    <div className="w-full flex flex-col justify-center items-start gap-1 mt-4">
                        <label htmlFor="Period" className="text-white text-xs">Period</label>
                        <select
                            className="w-full p-2 text-white bg-[#594872] rounded-full outline-none"
                            onChange={(e) => { setDownPeriod(Number(e.target.value)) }}
                        >
                            <option value="60">1m</option>
                            <option value="120">2m</option>
                            <option value="300">5m</option>
                            <option value="600">10m</option>
                            <option value="1800">30m</option>
                        </select>
                    </div>

                    <div className="w-full flex flex-col justify-center items-start gap-1 mt-4">
                        <label htmlFor="Period" className="text-white text-xs">Order Amount</label>
                        <input
                            className="w-full p-2 text-white bg-[#594872] rounded-full outline-none px-4"
                            value={downBetAmount}
                            onChange={(e) => { setDownBetAmount(Number(e.target.value)) }}
                        />
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-2 mt-4">
                        <div className="w-full text-sm flex justify-between items-center">
                            <span className="text-white/60">Win Prize</span>
                            <div className="font-bold text-white/80">{downWinPrize}</div>
                        </div>
                    </div>

                    <button className="w-full bg-[#594872] mt-6 py-3 font-bold text-white rounded-full mb-8" onClick={handleBuyDown}>Confirm Order</button>
                </div>
            </div>

            <div className={`w-full h-screen fixed top-0 flex justify-center items-end z-50 ${isShowBuyUp ? "flex" : "hidden"}`}>
                <div className="w-full flex flex-col justify-center items-center bg-[#3c2d51] px-5">
                    <div className="w-full relative flex justify-center items-center">
                        <h1 className="text-white text-center font-bold text-lg">Futures</h1>
                        <span className="right-4 text-white absolute" onClick={() => setIsShowBuyUp(false)}>X</span>
                    </div>

                    <div className="w-full flex gap-2">
                        <div className="relative">
                            <img src={BTC} alt="" className="w-7 absolute top-3 -left-2 border-2 border-[#58009f9e] rounded-full" />
                            <img src={USDT} alt="" className="w-7 border-2 border-[#58009f9e] rounded-full" />
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-md">BTCUSDT</span>
                            <span className="text-xs">BTC/USDT</span>
                        </div>
                    </div>

                    <div className="w-full flex mt-2 gap-4 items-end">
                        <h1 className="text-white text-[27px] font-medium">{priceUsd}</h1>
                    </div>

                    <div className="w-full flex justify-center items-center">
                        <div className="w-1/2 flex flex-col justify-center items-center">
                            <History className="w-4 text-white" />
                            <span className="text-xs text-white">{Date()}</span>
                        </div>
                    </div>

                    <div className="w-full flex px-2 bg-[#2b1c40] mt-2 rounded-md py-2 justify-between items-center">
                        <span className="text-white text-xs">Betting Type</span>
                        <span className="text-red-500 text-sm">Buy Up</span>
                    </div>

                    <div className="w-full flex flex-col justify-center items-start gap-1 mt-4">
                        <label htmlFor="Period" className="text-white text-xs">Period</label>
                        <select name="" id="" className="w-full p-2 text-white bg-[#594872] rounded-full outline-none" onChange={(e) => { setUpPeriod(Number(e.target.value)) }} >
                            <option value="60">1m</option>
                            <option value="180">3m</option>
                            <option value="300">5m</option>
                            <option value="600">10m</option>
                            <option value="1800">30m</option>
                        </select>
                    </div>

                    <div className="w-full flex flex-col justify-center items-start gap-1 mt-4">
                        <label htmlFor="Period" className="text-white text-xs">Order Amount</label>
                        <input
                            className="w-full p-2 text-white bg-[#594872] rounded-full outline-none px-4"
                            onChange={(e) => { setUpBetAmount(Number(e.target.value)) }}
                            value={upBetAmount}
                        />
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-2 mt-4">
                        <div className="w-full text-sm flex justify-between items-center">
                            <span className="text-white/60">Win Prize</span>
                            <div className="font-bold text-white/80">${upWinPrize}</div>
                        </div>
                    </div>

                    <button className="w-full text-white bg-[#594872] mt-6 py-3 font-bold rounded-full mb-8" onClick={handleBuyUp}>Confirm Order</button>
                </div>
            </div>

        </div>
    )
}

export default Home;