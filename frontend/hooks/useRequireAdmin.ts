// // hooks/useRequireAdmin.ts
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// export function useRequireAdmin() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { data } = await supabase.auth.getSession();
//       const token = data?.session?.access_token;

//       if (!token) {
//         window.location.href = "/login";
//         return;
//       }

//       // Ask backend who this user is (also checks role via DB)
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//         credentials: "include",
//       });

//       if (!res.ok) {
//         window.location.href = "/login";
//         return;
//       }

//       const { profile } = await res.json();
//       if (profile?.role !== "superadmin") {
//         window.location.href = "/login";
//         return;
//       }

//       setReady(true);
//     })();
//   }, []);

//   return ready;
// }
