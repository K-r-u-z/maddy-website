'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { css } from 'styled-components';

const FAQSection = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]} 0%,
    white 25%,
    ${({ theme }) => theme.colors.primary[100]} 50%,
    white 75%,
    ${({ theme }) => theme.colors.primary[100]} 100%
  );
  min-height: 90vh;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
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
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0 auto;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const FAQItem = styled.div<{ $isOpen: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const QuestionText = styled.p<{ $isOpen: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  line-height: 1.4;
  margin: 0;
  padding: 20px;
  padding-right: 50px;
  text-align: left;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 16px;
    padding-right: 40px;
  }
`;

const Question = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  margin: 0;
  position: relative;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  &:after {
    content: '+';
    font-size: 1.75rem;
    font-weight: 300;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    color: ${({ theme }) => theme.colors.primary[500]};
    width: 24px;
    text-align: center;
    flex-shrink: 0;
    position: absolute;
    right: ${({ theme }) => theme.spacing.lg};

    @media (max-width: 768px) {
      font-size: 1.5rem;
      right: ${({ theme }) => theme.spacing.md};
    }
  }
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  background: white;
  padding: 0px;
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-10px')});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  overflow: hidden;
`;

const AnswerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
  padding-left: ${({ theme }) => theme.spacing['2xl']};
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};
  border-top: 5px solid ${({ theme }) => theme.colors.primary[100]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const AnswerText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: 1.8;
  margin: 0px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

const FAQ = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/public/faq');
        if (!response.ok) throw new Error('Failed to fetch FAQs');
        const data = await response.json();
        setFaqItems(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Use placeholder data if fetch fails
        setFaqItems([
          {
            _id: '1',
            question: "How far in advance should I place my order?",
            answer: "For standard orders, we recommend placing your order at least 1 week in advance. For large events or custom designs, please order 2-3 weeks ahead to ensure availability. During peak seasons (holidays, graduation, etc.), earlier ordering is recommended.",
            order: 1
          },
          {
            _id: '2',
            question: "What flavors are available?",
            answer: "Our classic flavors include Vanilla, Double Chocolate, Strawberry Dream, Red Velvet, Birthday Cake, and Cookies & Cream. We also offer seasonal flavors and can accommodate special requests. Check our menu section for our current flavor selection and availability.",
            order: 2
          },
          {
            _id: '3',
            question: "Do you offer custom designs?",
            answer: "Yes! We love creating custom designs for special occasions. Whether it's for birthdays, weddings, corporate events, or any celebration, we can match your theme, colors, and preferences. Custom designs may require additional time and cost - please include your design ideas in the order form.",
            order: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <FAQSection id="faq">
      <Container>
        <Header>
          <Title>Frequently Asked Questions</Title>
          <Description>
            Find answers to common questions about our cake pops and ordering process.
          </Description>
        </Header>
        {faqItems.map((item) => (
          <FAQItem 
            key={item._id}
            $isOpen={openItems.includes(item._id)}
            onClick={() => toggleItem(item._id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleItem(item._id);
              }
            }}
          >
            <Question $isOpen={openItems.includes(item._id)}>
              <QuestionText $isOpen={openItems.includes(item._id)}>
                {item.question}
              </QuestionText>
            </Question>
            <Answer $isOpen={openItems.includes(item._id)}>
              <AnswerContent>
                <AnswerText>{item.answer}</AnswerText>
              </AnswerContent>
            </Answer>
          </FAQItem>
        ))}
      </Container>
    </FAQSection>
  );
};

export default FAQ; 