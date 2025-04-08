import Footer from "../login/footer";
import Header from "../login/header";

import ResetPage from "./page";


export default function ResetPassword(){
    return(
        <div className="min-h-screen bg-gray-100">
        <Header />
        <ResetPage />
        <Footer />
        </div>
    )
}