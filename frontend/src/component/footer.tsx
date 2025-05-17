import { Coins, HandCoins, HomeIcon, ChartBar, Scroll } from "lucide-react";

const Footer = () => {

    return (
        <div className="w-full h-16 bg-[#56265e] flex absolute bottom-0 justify-center items-center">
            <div className="flex gap-8">
                <a href="/home" className="flex flex-col justify-center items-center">
                    <HomeIcon color="white" />
                    <span className="text-white">Home</span>
                </a>
                <a href="/market" className="flex flex-col justify-center items-center">
                    <ChartBar color="white" />
                    <span className="text-white">Market</span>
                </a>
                <a href="/bet" className="flex flex-col justify-center items-center">
                    <HandCoins color="white" />
                    <span className="text-white">Bet</span>
                </a>
                <a href="/history" className="flex flex-col justify-center items-center">
                    <Scroll color="white" />
                    <span className="text-white">History</span>
                </a>
                <a href="/balance" className="flex flex-col justify-center items-center">
                    <Coins color="white" />
                    <span className="text-white">Balance</span>
                </a>
            </div>
        </div>
    )
}

export default Footer;