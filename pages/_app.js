import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Protected routes that require authentication
  const protectedRoutes = ['/coins', '/profile', '/transactions'];
  
  // Public routes that redirect to coins if authenticated
  const publicRoutes = ['/auth/login', '/auth/register'];

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      const currentPath = router.pathname;

      // Redirect to login if accessing protected route without auth
      if (protectedRoutes.includes(currentPath) && !isAuth) {
        router.push('/auth/login');
        return;
      }

      // Redirect to coins if accessing auth pages while authenticated
      if (publicRoutes.includes(currentPath) && isAuth) {
        router.push('/coins');
        return;
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for route changes
    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []); // Không cần dependency vì dùng event listener

  return <Component {...pageProps} />;
}

export default MyApp;
