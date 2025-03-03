'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface OrderStep {
  _id?: string;
  stepNumber: number;
  title: string;
  description: string;
}

interface OrderStepsEditorProps {
  onLoad?: () => void;
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

const StepList = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const StepCard = styled.div<{ $isActive?: boolean }>`
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

const StepTitle = styled.h3`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary[700]};
`;

const StepDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: 0.9rem;
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
  min-height: 100px;
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
    min-height: 80px;
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

const OrderStepsEditor = ({ onLoad }: OrderStepsEditorProps) => {
  const [steps, setSteps] = useState<OrderStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<OrderStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSteps = async () => {
    try {
      console.log('Fetching order steps...');
      const response = await fetch('/api/order-steps');
      const data = await response.json();
      console.log('Fetched steps:', data);
      setSteps(data);
      onLoad?.();
    } catch (error) {
      console.error('Error fetching order steps:', error);
      onLoad?.();
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting form...');

    try {
      const method = selectedStep?._id ? 'PUT' : 'POST';
      const url = selectedStep?._id 
        ? `/api/order-steps/${selectedStep._id}` 
        : '/api/order-steps';

      console.log('Making request to:', url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedStep),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        console.log('Save successful, fetching updated steps...');
        await fetchSteps();
        console.log('Setting selectedStep to null...');
        setSelectedStep(null);
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
      }
    } catch (error) {
      console.error('Error saving order step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Starting delete operation for step id:', id);
    try {
      const response = await fetch(`/api/order-steps/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete step');
      }

      // Update local state first
      setSteps(prevSteps => prevSteps.filter(step => step._id !== id));
      console.log('Step removed from local state');

      // Fetch fresh data from server
      await fetchSteps();
      console.log('Steps refreshed from server');
      setSelectedStep(null);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete step');
      throw error;
    }
  };

  const handleCardClick = (e: React.MouseEvent, step: OrderStep) => {
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    setSelectedStep(step);
  };

  return (
    <EditorContainer $isEditing={!!selectedStep}>
      <StepList>
        <Button 
          onClick={() => setSelectedStep({ stepNumber: steps.length + 1, title: '', description: '' })}
          style={{ marginBottom: '1rem', width: '100%' }}
        >
          Add New Step
        </Button>
        {steps.map((step) => (
          <StepCard 
            key={step._id}
            $isActive={selectedStep?._id === step._id}
            onClick={(e) => handleCardClick(e, step)}
          >
            <CardHeader>
              <ContentSection>
                <StepTitle>Step {step.stepNumber}: {step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </ContentSection>
              <ActionButtons>
                <IconButton 
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStep(step);
                  }}
                  aria-label="Edit step"
                >
                  <FaEdit size={18} />
                </IconButton>
                <IconButton 
                  className="action-button delete"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!step._id) {
                      console.error('No step ID found');
                      return;
                    }
                    if (window.confirm('Are you sure you want to delete this step?')) {
                      try {
                        await handleDelete(step._id);
                      } catch (error) {
                        console.error('Failed to delete step:', error);
                        alert('Failed to delete step. Please try again.');
                      }
                    }
                  }}
                  aria-label="Delete step"
                >
                  <FaTrash size={18} />
                </IconButton>
              </ActionButtons>
            </CardHeader>
          </StepCard>
        ))}
      </StepList>

      {selectedStep && (
        <EditorForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Step Number</Label>
            <Input
              type="number"
              value={selectedStep.stepNumber}
              onChange={(e) => setSelectedStep({ ...selectedStep, stepNumber: parseInt(e.target.value) })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              value={selectedStep.title}
              onChange={(e) => setSelectedStep({ ...selectedStep, title: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <TextArea
              value={selectedStep.description}
              onChange={(e) => setSelectedStep({ ...selectedStep, description: e.target.value })}
              required
            />
          </FormGroup>
          <ButtonContainer>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (selectedStep._id ? 'Update Step' : 'Add Step')}
            </Button>
          </ButtonContainer>
        </EditorForm>
      )}
    </EditorContainer>
  );
};

export default OrderStepsEditor; 