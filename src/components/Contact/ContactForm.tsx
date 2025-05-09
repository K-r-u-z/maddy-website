'use client'

import { useState, FormEvent, useId } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

// Constants for file validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const Form = styled.form`
  background: white;
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[200]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[200]};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary[300]};
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ImageUploadContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
`;

const ImagePreview = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${({ theme }) => theme.colors.error[500]};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  font-size: 16px;
  line-height: 1;

  &:hover {
    background: ${({ theme }) => theme.colors.error[600]};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: transparent;
  border: 2px dashed ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const ContactForm = () => {
  const formId = useId();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 1200; // Max width/height
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality 0.8
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            0.8
          );
        };
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const validateFiles = (files: File[]): string | null => {
    // Check total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return `Total upload size exceeds ${MAX_TOTAL_SIZE / (1024 * 1024)}MB`;
    }

    // Check individual file sizes and types
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return `File ${file.name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `File ${file.name} is not a supported image type`;
      }
    }

    return null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Compress images
      const compressedFiles = await Promise.all(files.map(compressImage));
      
      // Update state with compressed files
      const newImages = [...images, ...compressedFiles];
      setImages(newImages);

      // Create preview URLs for new images
      const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
      
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Failed to process images. Please try again.');
      console.error('Image processing error:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/public/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setImages([]);
      setImagePreviewUrls(urls => {
        urls.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <FormGroup>
        <Label htmlFor={`${formId}-name`}>Name</Label>
        <Input
          type="text"
          id={`${formId}-name`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor={`${formId}-email`}>Email</Label>
        <Input
          type="email"
          id={`${formId}-email`}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor={`${formId}-subject`}>Subject</Label>
        <Input
          type="text"
          id={`${formId}-subject`}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor={`${formId}-message`}>Message</Label>
        <TextArea
          id={`${formId}-message`}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </FormGroup>

      <ImageUploadContainer>
        <Label>Have reference picture(s)?</Label>
        <FileInput
          type="file"
          id={`${formId}-images`}
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <UploadButton
          type="button"
          onClick={() => document.getElementById(`${formId}-images`)?.click()}
        >
          Click to upload images
        </UploadButton>
        
        {imagePreviewUrls.length > 0 && (
          <ImagePreviewGrid>
            {imagePreviewUrls.map((url, index) => (
              <ImagePreviewContainer key={url}>
                <RemoveImageButton
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  ×
                </RemoveImageButton>
                <ImagePreview>
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </ImagePreview>
              </ImagePreviewContainer>
            ))}
          </ImagePreviewGrid>
        )}
      </ImageUploadContainer>
      
      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </SubmitButton>
    </Form>
  );
};

export default ContactForm; 