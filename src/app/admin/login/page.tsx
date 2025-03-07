'use client'

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout/Layout';
import PasswordResetModal from '@/components/Admin/PasswordResetModal';

const LoginContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary[50]};
`;

const LoginForm = styled.form`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: underline;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.9em;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        setAdminExists(data.exists);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username, password });
      const result = await signIn('credentials', {
        username: username.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <LoginContainer>
        {adminExists === false ? (
          <div>
            <p>No admin account exists yet.</p>
            <Link href="/admin/setup">
              <Button>Setup Admin Account</Button>
            </Link>
          </div>
        ) : (
          <LoginForm onSubmit={handleSubmit}>
            <Title>Admin Login</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <ResetButton type="button" onClick={() => setShowResetModal(true)}>
              Reset Password
            </ResetButton>
          </LoginForm>
        )}
        {showResetModal && (
          <PasswordResetModal onClose={() => setShowResetModal(false)} />
        )}
      </LoginContainer>
    </Layout>
  );
} 