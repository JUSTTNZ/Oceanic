import { useRouter } from "next/router";
import Footer from "./footer";
import Header from "./header";
import LoginPage from "./page";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface RootState {
  user: {
    uid: number;
    email: string;
    username: string;
    roles: string;
  } | null;
}

export default function Login() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      router.replace("/markets");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  // Don't render anything while checking auth
  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoginPage />
      <Footer />
    </div>
  );
}
