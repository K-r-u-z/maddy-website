'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const Message = styled.div<{ $isError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $isError }) =>
    $isError ? theme.colors.error[50] : theme.colors.success[50]};
  color: ${({ theme, $isError }) =>
    $isError ? theme.colors.error[600] : theme.colors.success[600]};
  border: 1px solid ${({ theme, $isError }) =>
    $isError ? theme.colors.error[200] : theme.colors.success[200]};
`;

interface EmailResponderProps {
  onLoad?: () => void;
}

const EmailResponder = ({ onLoad }: EmailResponderProps) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    from: 'contact' as 'contact' | 'noreply'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setMessage({
        text: 'Email sent successfully!',
        isError: false
      });
      setFormData({
        to: '',
        subject: '',
        message: '',
        from: 'contact'
      });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to send email',
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {message && (
          <Message $isError={message.isError}>
            {message.text}
          </Message>
        )}

        <FormGroup>
          <Label htmlFor="from">From</Label>
          <Select
            id="from"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value as 'contact' | 'noreply' })}
          >
            <option value="contact">contact@cakepopsbymaddy.com</option>
            <option value="noreply">noreply@cakepopsbymaddy.com</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="email"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Email'}
        </Button>
      </Form>
    </Container>
  );
};

export default EmailResponder; 