import Footer from "./login/footer";
import Header from "./login/header";
import LoginPage from "./login/page";


export default function Login(){
    return(
        <div className="min-h-screen bg-gray-100">
        <Header />
        <LoginPage />
        <Footer />
        </div>
    )
}