'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MenuEditor from '@/components/Admin/MenuEditor';
import OrderStepsEditor from '@/components/Admin/OrderStepsEditor';
import FAQEditor from '@/components/Admin/FAQEditor';
import Navigation from '@/components/Admin/Navigation';
import AboutEditor from '@/components/Admin/AboutEditor';
import EmailResponder from '@/components/Admin/EmailResponder';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primary[50]};
  padding-top: 70px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const TabContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.primary[100]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary[500] : 'white'};
  color: ${({ $isActive, theme }) => 
    $isActive ? 'white' : theme.colors.primary[500]};
  border: 2px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9rem;
  }

  &:hover {
    background: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.primary[600] : theme.colors.primary[50]};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EditorContainer = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary[500]};
  padding-top: 70px;
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Reset loading state when tab changes
  useEffect(() => {
    setIsDataLoading(true);
  }, [activeTab]);

  if (status === "loading") {
    return (
      <>
        <Navigation />
        <LoadingContainer>Loading...</LoadingContainer>
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navigation />
      <AdminContainer>
        <ContentWrapper>
          <TabContainer>
            <Tab 
              $isActive={activeTab === 'menu'} 
              onClick={() => setActiveTab('menu')}
            >
              Menu Items
            </Tab>
            <Tab 
              $isActive={activeTab === 'orderSteps'} 
              onClick={() => setActiveTab('orderSteps')}
            >
              How to Order
            </Tab>
            <Tab 
              $isActive={activeTab === 'faq'} 
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </Tab>
            <Tab 
              $isActive={activeTab === 'about'} 
              onClick={() => setActiveTab('about')}
            >
              About
            </Tab>
            <Tab 
              $isActive={activeTab === 'email'} 
              onClick={() => setActiveTab('email')}
            >
              Email
            </Tab>
          </TabContainer>

          <EditorContainer>
            {isDataLoading && activeTab !== 'email' && (
              <LoadingContainer style={{ minHeight: '300px' }}>Loading...</LoadingContainer>
            )}
            <div style={{ display: (isDataLoading && activeTab !== 'email') ? 'none' : 'block' }}>
              {activeTab === 'menu' && <MenuEditor onLoad={() => setIsDataLoading(false)} />}
              {activeTab === 'orderSteps' && <OrderStepsEditor onLoad={() => setIsDataLoading(false)} />}
              {activeTab === 'faq' && <FAQEditor onLoad={() => setIsDataLoading(false)} />}
              {activeTab === 'about' && <AboutEditor onLoad={() => setIsDataLoading(false)} />}
              {activeTab === 'email' && <EmailResponder onLoad={() => setIsDataLoading(false)} />}
            </div>
          </EditorContainer>
        </ContentWrapper>
      </AdminContainer>
    </>
  );
} 