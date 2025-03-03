'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout/Layout';

const Container = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary[50]};
`;

const SetupCard = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
  }
`;

const Message = styled.p<{ $isError?: boolean }>`
  color: ${({ theme, $isError }) => 
    $isError ? 'red' : theme.colors.primary[700]};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SetupContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

export default function AdminSetup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin already exists
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        
        if (data.exists) {
          router.push('/admin/login');
        }
        setIsLoading(false);
      } catch (error) {
        setError('Error checking admin status');
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin account');
      }

      router.push('/admin/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Container>
        <SetupCard>
          <Title>Initial Admin Setup</Title>
          <Form onSubmit={handleSubmit}>
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
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Create Admin Account</Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
        </SetupCard>
      </Container>
    </Layout>
  );
} 