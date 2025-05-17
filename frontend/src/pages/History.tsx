import axios from "axios";
import { useEffect, useState } from "react";
import Btc from '../assets/imgs/btc.png';

const History = () => {
    const [orderList, setOrderList] = useState<any[]>([]);

    useEffect(() => {
        axios.get('/api/get_history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setOrderList(res.data || []);
        }).catch(err => {
            console.error("Failed to fetch history", err);
            setOrderList([]);
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#36164e] from-gray-100 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
            <h1 className="mt-8 text-3xl text-white">Bet History</h1>

            {
                (orderList.length === 0 || orderList.length === undefined) ? (
                    <p className="mt-6 text-white text-xl">No history</p>
                ) : (
                    orderList.map((item: any, index: number) => {
                        const datetime = new Date(item.timestamp);
                        return (
                            <div className="w-[95%] h-24 bg-[#7700dd] rounded-xl mt-6 flex items-center justify-between p-4 text-white text-lg" key={index}>
                                <div className="flex items-center">
                                    <img src={Btc} className="rounded-full w-12" />
                                    <span>${item.pricestamp}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span>{datetime.toString()}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span>${item.betAmount}</span>
                                    <span>{item.period}s</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span>{item.betType}</span>
                                    <span>{item.status}</span>
                                </div>
                            </div>
                        );
                    })
                )
            }
        </div>
    );
}

export default History;