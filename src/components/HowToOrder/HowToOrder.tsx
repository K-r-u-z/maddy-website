'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const HowToOrderSection = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[200]} 0%,
    ${({ theme }) => theme.colors.primary[100]} 25%,
    ${({ theme }) => theme.colors.primary[200]} 50%,
    ${({ theme }) => theme.colors.primary[100]} 75%,
    ${({ theme }) => theme.colors.primary[200]} 100%
  );
  min-height: 90vh;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Step = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: 1.6;
`;

interface OrderStep {
  _id: string;
  stepNumber: number;
  title: string;
  description: string;
}

const HowToOrder = () => {
  const [orderSteps, setOrderSteps] = useState<OrderStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderSteps = async () => {
      try {
        const response = await fetch('/api/public/order-steps');
        if (!response.ok) throw new Error('Failed to fetch order steps');
        const data = await response.json();
        setOrderSteps(data);
      } catch (error) {
        console.error('Error fetching order steps:', error);
        // Use placeholder data if fetch fails
        setOrderSteps([
          {
            _id: '1',
            stepNumber: 1,
            title: 'Fill Out Order Form',
            description: 'Complete our order form with your desired flavors, quantities, and event details. (Order form coming soon)'
          },
          {
            _id: '2',
            stepNumber: 2,
            title: 'Review Quote',
            description: 'We\'ll review your request and send you a pricing estimate. You can then decide to proceed with your order.'
          },
          {
            _id: '3',
            stepNumber: 3,
            title: 'Make Payment',
            description: 'Once you approve the quote, complete your payment to confirm your order.'
          },
          {
            _id: '4',
            stepNumber: 4,
            title: 'Enjoy Your Cake Pops!',
            description: 'Pick up your freshly made cake pops and enjoy your delicious treats!'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSteps();
  }, []);

  return (
    <HowToOrderSection id="how-to-order">
      <Container>
        <Header>
          <Title>How to Order</Title>
          <Description>
            Follow these simple steps to order your custom cake pops. We'll work together to create the perfect treats for your special occasion!
          </Description>
        </Header>
        <StepsContainer>
          {orderSteps.map((step) => (
            <Step key={step._id}>
              <StepNumber>Step {step.stepNumber}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>
                {step.description}
              </StepDescription>
            </Step>
          ))}
        </StepsContainer>
      </Container>
    </HowToOrderSection>
  );
};

export default HowToOrder; 