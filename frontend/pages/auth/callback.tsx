'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useDispatch } from 'react-redux';
import { setUser } from '@/action';
import { useToast } from '@/hooks/toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

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

type VerificationState = 'verifying' | 'success' | 'error';

export default function AuthCallback() {
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const ran = useRef(false);
  
  const [verificationState, setVerificationState] = useState<VerificationState>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
      // Prevents the effect from running twice in development with React.StrictMode
      if (ran.current) return;
      ran.current = true;
  
      const handleSession = async (session: import('@supabase/supabase-js').Session | null) => {
        console.log('Handling session:', session);
  
        if (session) {
          try {
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
              const errorText = await resp.text().catch(() => 'Profile initialization failed.');
              console.error('INIT /api/v1/users/init failed:', errorText);
              throw new Error('Could not load your profile. Please try logging in again.');
            }
  
            const { profile } = (await resp.json()) as InitResponse;
  
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
  
            setVerificationState('success');
            setMessage('Success! Your email has been verified.');
            setTimeout(() => setShowButton(true), 500);
  
            if (profile.role === 'superadmin') {
              showToast('Welcome Admin!', 'success');
              router.replace('/adminpage');
            } else {
              showToast('Login successful!', 'success');
              router.replace('/markets');
            }
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            console.error('Auth callback error:', err);
            setVerificationState('error');
            setMessage(errorMsg);
            setShowButton(true);
            showToast(errorMsg, 'error');
          }
        } else {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const errorDescription = params.get('error_description');
          const errorMsg = errorDescription || 'Authentication failed. Please try again.';
          setVerificationState('error');
          setMessage(errorMsg);
          setShowButton(true);
          showToast(errorMsg, 'error');
        }
      };
  
      // Immediately check if a session exists
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('Session found immediately.');
          handleSession(session);
        } else {
          console.log('No initial session, setting up auth listener.');
          // If no session, set up the listener as a fallback
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Unsubscribe immediately after the first event to avoid multiple triggers
            subscription?.unsubscribe();
            console.log('onAuthStateChange event:', event);
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
              handleSession(session);
            }
          });
  
          // Set a timeout in case the listener never fires
          const timeoutId = setTimeout(() => {
            subscription?.unsubscribe();
            if (verificationState === 'verifying') {
              console.error('Auth callback timed out.');
              setVerificationState('error');
              setMessage('Authentication timed out. Please try again.');
              setShowButton(true);
              showToast('Authentication timed out. Please try again.', 'error');
            }
          }, 10000);
  
          return () => {
            subscription?.unsubscribe();
            clearTimeout(timeoutId);
          };
        }
      });
  
    }, [dispatch, router, showToast, verificationState]);
  const handleProceed = () => {
    if (verificationState === 'success') {
      router.push('/markets');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Icon Container with Animation */}
            <div className="flex justify-center">
              <div className={`
                transition-all duration-500 ease-out
                ${verificationState === 'verifying' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}
              `}>
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              </div>
              
              <div className={`
                transition-all duration-500 ease-out
                ${verificationState === 'success' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}
              `}>
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-in fade-in zoom-in duration-500" />
              </div>
              
              <div className={`
                transition-all duration-500 ease-out
                ${verificationState === 'error' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}
              `}>
                <XCircle className="w-16 h-16 text-red-500 animate-in fade-in zoom-in duration-500" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-3">
              <h1 className={`
                text-2xl font-bold transition-all duration-500
                ${verificationState === 'success' ? 'text-green-400' : 
                  verificationState === 'error' ? 'text-red-400' : 'text-gray-100'}
              `}>
                {message}
              </h1>
              
              {verificationState === 'success' && (
                <p className="text-gray-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                  You will be redirected to the markets page shortly.
                </p>
              )}
              
              {verificationState === 'error' && (
                <p className="text-gray-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                  Please return to the login page and try again.
                </p>
              )}
            </div>

            {/* Action Button */}
            {showButton && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-500">
                <button
                  onClick={handleProceed}
                  className={`
                    w-full py-3 px-4 rounded-lg font-semibold text-white
                    transition-all duration-300 transform hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${verificationState === 'success' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'}
                  `}
                >
                  {verificationState === 'success' ? 'Go to Markets' : 'Return to Login'}
                </button>
              </div>
            )}

            {/* Loading Dots Animation */}
            {verificationState === 'verifying' && (
              <div className="flex justify-center space-x-2 pt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-xs mt-6 animate-in fade-in duration-1000 delay-700">
            Secured by Supabase Authentication
          </p>
        </div>
      </div>
    </>
  );
}