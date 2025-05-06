'use client'

import styled from 'styled-components';
import Layout from '@/components/Layout/Layout';

const PrivacyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Text = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const List = styled.ul`
  list-style-type: disc;
  margin-left: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ListItem = styled.li`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Disclaimer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

export default function PrivacyPolicy() {
  return (
    <Layout>
      <PrivacyContainer>
        <Title>Privacy Policy & Food Safety Information</Title>

        <Section>
          <SectionTitle>Home-Based Food Production Disclosure</SectionTitle>
          <Disclaimer>
            <Text>
              PROCESSED AND PREPARED BY A HOME-BASED FOOD PRODUCTION OPERATION THAT IS NOT SUBJECT TO SOUTH CAROLINA'S FOOD SAFETY REGULATIONS
            </Text>
          </Disclaimer>
          <Text>
            Cake Pops by Maddy operates as a home-based food production business under South Carolina's Cottage Food Law. This means our products are prepared in a home kitchen that is not subject to state food safety regulations or inspection.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Food Safety & Allergen Information</SectionTitle>
          <Text>
            We are committed to maintaining high standards of food safety and cleanliness in our home kitchen. However, please be aware that:
          </Text>
          <List>
            <ListItem>Our kitchen is not inspected by the South Carolina Department of Health and Environmental Control (DHEC)</ListItem>
            <ListItem>We are not required to obtain a retail food establishment permit</ListItem>
            <ListItem>Our products are prepared in a home kitchen that may contain common allergens</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Allergen Information</SectionTitle>
          <Text>
            Our products may contain or come into contact with the following allergens:
          </Text>
          <List>
            <ListItem>Wheat</ListItem>
            <ListItem>Milk</ListItem>
            <ListItem>Eggs</ListItem>
            <ListItem>Soy</ListItem>
            <ListItem>Tree Nuts</ListItem>
            <ListItem>Peanuts</ListItem>
          </List>
          <Text>
            We take allergen safety seriously and make every effort to prevent cross-contamination, but we cannot guarantee that our products are free from traces of allergens.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Sales Limitations</SectionTitle>
          <Text>
            Under South Carolina's Cottage Food Law:
          </Text>
          <List>
            <ListItem>We can only sell directly to consumers within South Carolina</ListItem>
            <ListItem>We cannot sell to restaurants, grocery stores, or other retail establishments</ListItem>
            <ListItem>We cannot ship our products to other states</ListItem>
            <ListItem>We cannot sell products that require refrigeration</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Contact Information</SectionTitle>
          <Text>
            If you have any questions about our food safety practices or allergen information, please contact us at:
          </Text>
          <Text>
            Email: contact@cakepopsbymaddy.com
          </Text>
        </Section>
      </PrivacyContainer>
    </Layout>
  );
} 