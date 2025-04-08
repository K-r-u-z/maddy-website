'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ContactEditorProps {
  onLoad?: () => void;
}

interface Contact {
  _id?: string;
  description: string;
}

const EditorContainer = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  min-height: 200px;
  resize: vertical;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    min-height: 150px;
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
`;

const ContactEditor = ({ onLoad }: ContactEditorProps) => {
  const [contact, setContact] = useState<Contact>({ description: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch('/api/contact-page');
      const data = await response.json();
      if (data.description) {
        setContact(data);
      }
      onLoad?.();
    } catch (error) {
      console.error('Error fetching contact:', error);
      onLoad?.();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) throw new Error('Failed to update contact');

      const updatedContact = await response.json();
      setContact(updatedContact);
      alert('Contact page updated successfully!');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditorContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="description">Contact Page Description</Label>
          <TextArea
            id="description"
            value={contact.description}
            onChange={(e) => setContact({ ...contact, description: e.target.value })}
            placeholder="Enter the description for the contact page"
            required
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </EditorContainer>
  );
};

export default ContactEditor; 