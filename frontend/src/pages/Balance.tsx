import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Balance = () => {
    const [depositAddress] = useState();
    const [withdrawAddress, setWithdrawAddress] = useState("");
    const [amount, setAmount] = useState(0);

    const handleDeposit = () => {
        axios.post('/api/confirm_deposit', {amount: amount}, {headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }}).then((res) => {
            if (res.data.msg == 'Deposit confirmed') return toast.success('Deposit success.')
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0845] to-[#25003e] flex flex-col gap-8 items-center justify-center py-8 px-2">
            <div className="w-full max-w-md bg-[#2d1457] rounded-2xl shadow-2xl px-8 py-6 border border-white/10">
                <h1 className="text-white font-bold text-center text-xl mb-6">Deposit</h1>
                {/* <div className="mb-6">
                    <label className="block text-base font-semibold mb-2 text-white/90" htmlFor="deposit-address">Deposit Address</label>
                    <input
                        id="deposit-address"
                        type="text"
                        value={depositAddress}
                        readOnly
                        className="flex items-center gap-2 bg-[#3e2d54] px-3 py-3 rounded-full focus-within:ring-1 focus-within:ring-purple-500 transition w-full focus:outline-none placeholder:text-white text-white/60"
                    />
                </div> */}
                <div className="mb-10">
                    <label className="block text-base font-semibold mb-2 text-white/90" htmlFor="balance">Amount</label>
                    <div className="flex flex-row gap-3">
                        <input
                            id="balance"
                            type="text"
                            value={amount}
                            onChange={(e) => {setAmount(Number(e.target.value))}}
                            className="flex items-center gap-2 bg-[#3e2d54] px-3 py-3 rounded-full focus-within:ring-1 focus-within:ring-purple-500 transition w-36 focus:outline-none placeholder:text-white text-white/60"
                        />
                        <button
                            className="w-full bg-[#e478ff] text-white font-semibold py-3 rounded-full hover:bg-[#d55ee9] transition"
                            onClick={handleDeposit}
                        >
                            Confirm Deposit
                        </button>
                    </div>
                </div>
            </div>
{/* 
            <div className="w-full max-w-md bg-[#2d1457] rounded-2xl shadow-2xl p-8 border border-white/10">
                <h1 className="text-white font-bold text-center text-xl mb-6">Withdraw</h1>
                <div className="mb-6">
                    <label className="block text-base font-semibold mb-2 text-white/90" htmlFor="withdraw-address">Withdraw Address</label>
                    <input
                        id="withdraw-address"
                        type="text"
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                        className="flex items-center gap-2 bg-[#3e2d54] px-3 py-3 rounded-full focus-within:ring-1 focus-within:ring-purple-500 transition w-full focus:outline-none placeholder:text-white text-white/60"
                        placeholder="Enter withdraw address"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-base font-semibold mb-2 text-white/90" htmlFor="amount">Amount</label>
                    <div className="flex flex-row gap-3">
                        <input
                            id="amount"
                            type="text"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="flex items-center gap-2 bg-[#3e2d54] px-3 py-3 rounded-full focus-within:ring-1 focus-within:ring-purple-500 transition w-36 focus:outline-none placeholder:text-white text-white/60"
                            placeholder="Amount"
                        />
                        <button
                            className="w-full bg-[#e478ff] text-white font-semibold py-3 rounded-full hover:bg-[#d55ee9] transition"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Balance;