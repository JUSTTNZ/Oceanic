import Footer from "../login/footer";
import Header from "../login/header";
import RegistePage from "./page";


export default function Register(){
    return(
        <div className="min-h-screen bg-gray-100">
        <Header />
        <RegistePage />
        <Footer />
        </div>
    )
}