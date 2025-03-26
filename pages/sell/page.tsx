"use-client";   
import { ArrowLeftIcon } from "@heroicons/react/24/outline";    
export default function SendPage() {
    return ( 
        <div>
            <div className="bg-white ">
                <div className="flex items-center space-x-2 p-4">
                    <ArrowLeftIcon className="h-6 w-6"/>
                    <span>Back to home</span>
                </div>
                <hr className="text-gray-400 "/>
                <div className="flex justify-center items-center space-x-4 ">
                    <p>Buy</p>
                    <p>Sell</p>
                </div>
                <div></div>
            </div>
        </div>
    )
}