'use client'

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface AboutEditorProps {
  onLoad?: () => void;
}

interface About {
  _id?: string;
  title: string;
  description: string;
  image: string;
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

  &[type="file"] {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 14px;
    
    &::-webkit-file-upload-button {
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      margin-right: ${({ theme }) => theme.spacing.md};
      background: ${({ theme }) => theme.colors.primary[500]};
      color: white;
      border: none;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;

      &:hover {
        background: ${({ theme }) => theme.colors.primary[600]};
      }
    }
  }
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

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  position: relative;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
`;

const AboutEditor = ({ onLoad }: AboutEditorProps) => {
  const [about, setAbout] = useState<About>({ title: '', description: '', image: '' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      if (data._id) {
        setAbout(data);
        setImagePreview(data.image);
      }
      onLoad?.();
    } catch (error) {
      console.error('Error fetching about:', error);
      onLoad?.();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = about.image;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...about,
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update about');

      const updatedAbout = await response.json();
      setAbout(updatedAbout);
      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about section');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditorContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={about.description}
            onChange={(e) => setAbout({ ...about, description: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {imagePreview && (
            <ImagePreview>
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
            </ImagePreview>
          )}
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </EditorContainer>
  );
};

export default AboutEditor; 