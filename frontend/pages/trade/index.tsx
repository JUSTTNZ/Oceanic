import Footer from '../login/footer'
import Header from '../login/header'
import CryptoExchangePage from './page'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

interface RootState {
  user: {
    uid: number;
    email: string;
    username: string;
    roles: string;
  } | null;
}
export default function Send() {
      const router = useRouter();
      const user = useSelector((state: RootState) => state.user);
      const [checkingAuth, setCheckingAuth] = useState(true);
    
      useEffect(() => {
        if (!user) {
          router.replace("/login");
        } else {
          setCheckingAuth(false);
        }
      }, [user, router]);
    
      // Don't render anything while checking auth
      if (checkingAuth) return null;
    return (
        <div>
            <Header />
         
            <CryptoExchangePage />
            <Footer />
        </div>
    )
}