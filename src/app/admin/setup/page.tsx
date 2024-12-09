'use client'

import { useState } from 'react';
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

export default function AdminSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSetup = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create admin user');
        return;
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error) {
      setError('An error occurred while creating the admin user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <SetupCard>
          <Title>Admin Setup</Title>
          <Button 
            onClick={handleSetup} 
            disabled={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Create Admin User'}
          </Button>
          {message && <Message>{message}</Message>}
          {error && <Message $isError>{error}</Message>}
        </SetupCard>
      </Container>
    </Layout>
  );
} 