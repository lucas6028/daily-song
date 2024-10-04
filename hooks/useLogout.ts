'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await axios.delete('/api/auth', { withCredentials: true });

      window.localStorage.removeItem('profileImgUrl');
      window.localStorage.removeItem('country');
      window.localStorage.removeItem('email');
      window.localStorage.removeItem('followers');
      window.localStorage.removeItem('href');
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('product');

      router.push('/login');
    } catch (err) {
      console.error('Error while logging out:', err);
      console.log('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return { logout, isLoggingOut };
};
