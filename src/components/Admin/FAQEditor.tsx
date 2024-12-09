'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
}

const EditorContainer = styled.div<{ $isEditing: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isEditing }) => $isEditing ? '300px 1fr' : '1fr'};
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ $isEditing }) => $isEditing ? '1000px' : '600px'};
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 600px;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FAQList = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const FAQCard = styled.div<{ $isActive?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary[500] : theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background: ${({ theme }) => theme.colors.primary[50]};
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ContentSection = styled.div`
  flex: 1;
`;

const FAQTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary[700]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[600]};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 36px;
  height: 36px;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const EditorForm = styled.form`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
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
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  min-height: 150px;
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
    min-height: 120px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

interface FAQEditorProps {
  onLoad?: () => void;
}

const FAQEditor = ({ onLoad }: FAQEditorProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFAQs = async () => {
    try {
      console.log('Fetching FAQs...');
      const response = await fetch('/api/faq');
      const data = await response.json();
      console.log('Fetched FAQs:', data);
      setFaqs(data);
      onLoad?.();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      onLoad?.();
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting FAQ form...');

    try {
      const method = selectedFAQ?._id ? 'PUT' : 'POST';
      const url = selectedFAQ?._id 
        ? `/api/faq/${selectedFAQ._id}` 
        : '/api/faq';

      console.log('Making request to:', url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedFAQ),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        console.log('Save successful, fetching updated FAQs...');
        await fetchFAQs();
        console.log('Setting selectedFAQ to null...');
        setSelectedFAQ(null);
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Starting delete operation for FAQ id:', id);
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete FAQ');
      }

      // Update local state first
      setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== id));
      console.log('FAQ removed from local state');

      // Fetch fresh data from server
      await fetchFAQs();
      console.log('FAQs refreshed from server');
      setSelectedFAQ(null);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete FAQ');
      throw error;
    }
  };

  const handleCardClick = (e: React.MouseEvent, faq: FAQ) => {
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    setSelectedFAQ(faq);
  };

  return (
    <EditorContainer $isEditing={!!selectedFAQ}>
      <FAQList>
        <Button 
          onClick={() => setSelectedFAQ({ order: faqs.length + 1, question: '', answer: '' })}
          style={{ marginBottom: '1rem', width: '100%' }}
        >
          Add New FAQ
        </Button>
        {faqs.map((faq) => (
          <FAQCard 
            key={faq._id}
            $isActive={selectedFAQ?._id === faq._id}
            onClick={(e) => handleCardClick(e, faq)}
          >
            <CardHeader>
              <ContentSection>
                <FAQTitle>{faq.question}</FAQTitle>
              </ContentSection>
              <ActionButtons>
                <IconButton 
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFAQ(faq);
                  }}
                  aria-label="Edit FAQ"
                >
                  <FaEdit size={18} />
                </IconButton>
                <IconButton 
                  className="action-button delete"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!faq._id) {
                      console.error('No FAQ ID found');
                      return;
                    }
                    if (window.confirm('Are you sure you want to delete this FAQ?')) {
                      try {
                        await handleDelete(faq._id);
                      } catch (error) {
                        console.error('Failed to delete FAQ:', error);
                        alert('Failed to delete FAQ. Please try again.');
                      }
                    }
                  }}
                  aria-label="Delete FAQ"
                >
                  <FaTrash size={18} />
                </IconButton>
              </ActionButtons>
            </CardHeader>
          </FAQCard>
        ))}
      </FAQList>

      {selectedFAQ && (
        <EditorForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Order</Label>
            <Input
              type="number"
              value={selectedFAQ.order}
              onChange={(e) => setSelectedFAQ({ ...selectedFAQ, order: parseInt(e.target.value) })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Question</Label>
            <Input
              type="text"
              value={selectedFAQ.question}
              onChange={(e) => setSelectedFAQ({ ...selectedFAQ, question: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Answer</Label>
            <TextArea
              value={selectedFAQ.answer}
              onChange={(e) => setSelectedFAQ({ ...selectedFAQ, answer: e.target.value })}
              required
            />
          </FormGroup>
          <ButtonContainer>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (selectedFAQ._id ? 'Update FAQ' : 'Add FAQ')}
            </Button>
          </ButtonContainer>
        </EditorForm>
      )}
    </EditorContainer>
  );
};

export default FAQEditor; 