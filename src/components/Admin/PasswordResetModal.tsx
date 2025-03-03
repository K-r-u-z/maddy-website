'use client';

import { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  font-size: 1.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ $variant?: 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $variant }) => 
    $variant === 'secondary' ? 'white' : theme.colors.primary[500]};
  color: ${({ theme, $variant }) => 
    $variant === 'secondary' ? theme.colors.primary[500] : 'white'};
  border: ${({ theme, $variant }) => 
    $variant === 'secondary' ? `2px solid ${theme.colors.primary[500]}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'secondary' ? theme.colors.primary[50] : theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
  }
`;

const Message = styled.p<{ $type: 'error' | 'success' }>`
  color: ${({ theme, $type }) => 
    $type === 'error' ? theme.colors.error[500] : theme.colors.success[500]};
  margin: 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $type }) => 
    $type === 'error' ? theme.colors.error[50] : theme.colors.success[50]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

interface PasswordResetModalProps {
  onClose: () => void;
}

export default function PasswordResetModal({ onClose }: PasswordResetModalProps) {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess('Password updated successfully');
      setTimeout(onClose, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Reset Password</Title>
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
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Message $type="error">{error}</Message>}
          {success && <Message $type="success">{success}</Message>}
          <ButtonGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 