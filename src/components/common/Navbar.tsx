import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">TCM Prescription</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            {isAuthenticated && user?.role === 'doctor' && (
              <Link 
                href="/orders" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Orders
              </Link>
            )}
            {isAuthenticated && user?.role === 'pharmacy' && (
              <Link 
                href="/quotes" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Quotes
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link 
                  href="/admin/skus" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  SKUs
                </Link>
                <Link 
                  href="/admin/orders" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Orders
                </Link>
              </>
            )}
            <Link 
              href="/pharmacies" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Find Pharmacy
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {user?.name} ({user?.role})
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setIsLoginModalOpen(true)}>
              Login
            </Button>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
} 