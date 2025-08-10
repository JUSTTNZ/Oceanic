'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useDispatch } from 'react-redux';
import { setUser } from '@/action';
import { useToast } from '@/hooks/toast';

// Put these near the top of the file
interface Profile {
  supabase_user_id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  fullname: string;
  phoneNumber: string;
  createdAt: string;
}

interface InitResponse {
  ok: boolean;
  profile: Profile;
}

export default function AuthCallback() {
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // 1) Give Supabase a moment to process the hash on first load
        await new Promise((r) => setTimeout(r, 50));

        // 2) Try to read the session
        let { data: { session } } = await supabase.auth.getSession();

        // 3) If session isn’t ready yet, wait for the first auth state change
        if (!session) {
          const sub = supabase.auth.onAuthStateChange((_event, s) => {
            if (s) {
              session = s;
              sub.data.subscription.unsubscribe();
            }
          });
          // Wait for auth state to change
          await new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
              if (session) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 50);
          });
        }

        if (!session) {
          showToast('Session not found. Please login again.', 'error');
          return router.replace('/login');
        }

        // 4) Initialize / sync Mongo profile on your API
        const accessToken = session.access_token;
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            username: session.user?.user_metadata?.username,
            fullname: session.user?.user_metadata?.fullname,
            phoneNumber: session.user?.user_metadata?.phoneNumber,
          }),
        });

        if (!resp.ok) {
          const t = await resp.text().catch(() => '');
          console.error('INIT /api/v1/users/init failed:', t);
          showToast('Could not load your profile. Please try again.', 'error');
          return router.replace('/login');
        }

        const { profile } = (await resp.json()) as InitResponse;


        // 5) Store in Redux
        dispatch(
          setUser({
            uid: profile.supabase_user_id,
            email: profile.email,
            username: profile.username,
            role: profile.role,
            fullname: profile.fullname,
            createdAt: profile.createdAt,
            phoneNumber: profile.phoneNumber,
            lastLogin: new Date().toISOString(),
          })
        );

        // 6) Redirect based on role
        if (profile.role === 'superadmin') {
          showToast('Welcome Admin!', 'success');
          setTimeout(() => router.replace('/adminpage'), 1000);
        } else {
          showToast('Login successful!', 'success');
          setTimeout(() => router.replace('/markets'), 1000);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
        console.error('Auth callback error:', err);
        showToast(errorMsg, 'error');
        router.replace('/login');
      }
    })();
  }, [dispatch, router, showToast]);

  return (
    <>
      {ToastComponent}
      <p style={{ padding: 16 }}>Verifying your account, please wait…</p>
    </>
  );
}
