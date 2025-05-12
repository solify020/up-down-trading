import { Coins, HandCoins } from "lucide-react";

const Footer = () => {
    return (
        <div className="w-full h-16 bg-[#56265e] flex absolute bottom-0 justify-center items-center">
            <div className="flex gap-16">
                <a href="/home" className="flex flex-col justify-center items-center">
                    <HandCoins color="white" />
                    <span className="text-white">Trade</span>
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