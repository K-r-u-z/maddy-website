'use client'

import { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface MenuItem {
  _id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
  isVisible: boolean;
  isSoldOut: boolean;
  showPrice: boolean;
}

interface MenuEditorProps {
  onLoad?: () => void;
}

const EditorContainer = styled.div<{ $isEditing: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ $isEditing }) => $isEditing ? '600px' : '800px'};
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
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

const CancelButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral[700]};
  border: 2px solid ${({ theme }) => theme.colors.neutral[300]};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const AddButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

const ItemCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ItemImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.neutral[100]};
`;

const ItemContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ItemTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ItemDescription = styled.p`
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemPrice = styled.p`
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: 600;
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

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  position: relative;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const LoadingPlaceholder = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: #fff2f2;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid #ffcdd2;
`;

const PriceInputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PricePrefix = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-size: 16px;
  pointer-events: none;
`;

const PriceInput = styled(Input)`
  padding-left: calc(${({ theme }) => theme.spacing.md} + 12px);
`;

const VisibilityToggle = styled.button<{ $isVisible: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ $isVisible, theme }) => 
    $isVisible ? theme.colors.primary[500] : theme.colors.neutral[300]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ $isVisible, theme }) => 
      $isVisible ? theme.colors.primary[600] : theme.colors.neutral[400]};
  }
`;

const SoldOutToggle = styled.button<{ $isSoldOut: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ $isSoldOut, theme }) => 
    $isSoldOut ? theme.colors.neutral[700] : theme.colors.neutral[300]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ $isSoldOut, theme }) => 
      $isSoldOut ? theme.colors.neutral[800] : theme.colors.neutral[400]};
  }
`;

const PriceToggle = styled.button<{ $showPrice: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ $showPrice, theme }) => 
    $showPrice ? theme.colors.success[500] : theme.colors.neutral[300]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ $showPrice, theme }) => 
      $showPrice ? theme.colors.success[600] : theme.colors.neutral[400]};
  }
`;

const RemoveImageButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.error[500]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error[600]};
  }
`;

interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (id: string) => Promise<void>;
  onEdit: (item: MenuItem) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
  onToggleSoldOut: (id: string, isSoldOut: boolean) => Promise<void>;
  onTogglePrice: (id: string, showPrice: boolean) => Promise<void>;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onDelete, 
  onEdit,
  onToggleVisibility,
  onToggleSoldOut,
  onTogglePrice 
}) => (
  <ItemCard>
    <ItemImage>
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          fill
          style={{ 
            objectFit: 'cover', 
            opacity: !item.isVisible ? 0.5 : item.isSoldOut ? 0.7 : 1 
          }}
        />
      )}
    </ItemImage>
    <ItemContent>
      <ItemTitle>{item.title}</ItemTitle>
      <ItemDescription>{item.description}</ItemDescription>
      <ItemPrice>${item.price}</ItemPrice>
      <ButtonGroup>
        <VisibilityToggle
          onClick={async (e) => {
            e.stopPropagation();
            await onToggleVisibility(item._id!, !item.isVisible);
          }}
          $isVisible={item.isVisible}
          aria-label={`Toggle visibility ${item.isVisible ? 'off' : 'on'}`}
        >
          {item.isVisible ? 'Visible' : 'Hidden'}
        </VisibilityToggle>
        <SoldOutToggle
          onClick={async (e) => {
            e.stopPropagation();
            await onToggleSoldOut(item._id!, !item.isSoldOut);
          }}
          $isSoldOut={item.isSoldOut}
          aria-label={`Toggle sold out ${item.isSoldOut ? 'off' : 'on'}`}
        >
          {item.isSoldOut ? 'Sold Out' : 'In Stock'}
        </SoldOutToggle>
        <PriceToggle
          onClick={async (e) => {
            e.stopPropagation();
            await onTogglePrice(item._id!, !item.showPrice);
          }}
          $showPrice={item.showPrice}
          aria-label={`Toggle price ${item.showPrice ? 'off' : 'on'}`}
        >
          {item.showPrice ? 'Price On' : 'Price Off'}
        </PriceToggle>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          aria-label="Edit item"
        >
          <FaEdit size={18} />
        </IconButton>
        <IconButton 
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!item._id) {
              console.error('No item ID found');
              return;
            }
            if (window.confirm('Are you sure you want to delete this item?')) {
              try {
                await onDelete(item._id);
              } catch (error) {
                console.error('Failed to delete item:', error);
                alert('Failed to delete item. Please try again.');
              }
            }
          }}
          aria-label="Delete item"
        >
          <FaTrash size={18} />
        </IconButton>
      </ButtonGroup>
    </ItemContent>
  </ItemCard>
);

const MenuEditor = ({ onLoad }: MenuEditorProps) => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    try {
      console.log('Fetching menu items...');
      const response = await fetch('/api/menu');
      const data = await response.json();
      console.log('Fetched items:', data);
      setMenuItems(data);
      onLoad?.();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      onLoad?.();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImage(null);
    setImagePreview('');
    setEditingItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
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

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setPrice(item.price);
    setImagePreview(item.image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        image: imagePreview || '',
        isVisible: true,
        isSoldOut: false,
        showPrice: true
      };

      const url = editingItem?._id ? `/api/menu/${editingItem._id}` : '/api/menu';
      const method = editingItem?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save menu item');
      }

      await fetchItems();
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save menu item. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Starting delete operation for id:', id);
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete item');
      }

      // Update local state first
      setMenuItems(prevItems => prevItems.filter(item => item._id !== id));
      console.log('Item removed from local state');

      // Fetch fresh data from server
      await fetchItems();
      console.log('Items refreshed from server');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete item');
      throw error;
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }

      await fetchItems();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleToggleSoldOut = async (id: string, isSoldOut: boolean) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isSoldOut }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sold out status');
      }

      await fetchItems();
    } catch (error) {
      console.error('Error updating sold out status:', error);
      alert('Failed to update sold out status. Please try again.');
    }
  };

  const handleTogglePrice = async (id: string, showPrice: boolean) => {
    try {
      // Update local state immediately for optimistic UI
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, showPrice } : item
        )
      );

      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ showPrice }),
      });

      if (!response.ok) {
        // Revert the state if the request fails
        setMenuItems(prevItems =>
          prevItems.map(item =>
            item._id === id ? { ...item, showPrice: !showPrice } : item
          )
        );
        throw new Error('Failed to update price visibility');
      }

      // No need to fetch all items again since we've already updated the local state
      // await fetchItems();
    } catch (error) {
      console.error('Error updating price visibility:', error);
      alert('Failed to update price visibility. Please try again.');
    }
  };

  return (
    <EditorContainer $isEditing={!!editingItem}>
      {!editingItem ? (
        <>
          <AddButton 
            onClick={() => {
              setEditingItem({ 
                _id: undefined,
                title: '', 
                description: '', 
                price: '', 
                image: '',
                isVisible: true,
                isSoldOut: false,
                showPrice: true
              });
            }}
          >
            Add New Item
          </AddButton>

          <ItemList>
            {menuItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleVisibility={handleToggleVisibility}
                onToggleSoldOut={handleToggleSoldOut}
                onTogglePrice={handleTogglePrice}
              />
            ))}
          </ItemList>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">Price</Label>
            <PriceInputGroup>
              <PricePrefix>$</PricePrefix>
              <PriceInput
                id="price"
                name="price"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  const parts = value.split('.');
                  if (parts.length > 2) return;
                  if (parts[1] && parts[1].length > 2) return;
                  setPrice(value);
                }}
                placeholder="0.00"
                required
              />
            </PriceInputGroup>
          </FormGroup>
          <FormGroup>
            <Label>Image (Optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem' }}>
                <RemoveImageButton 
                  type="button" 
                  onClick={() => {
                    setImagePreview('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    setEditingItem(prev => prev ? { ...prev, image: '' } : null);
                  }}
                >
                  Remove Image
                </RemoveImageButton>
                <ImagePreview>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </ImagePreview>
              </div>
            )}
          </FormGroup>
          <ButtonGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingItem._id ? 'Update Item' : 'Add Item')}
            </Button>
            <CancelButton type="button" onClick={resetForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      )}
    </EditorContainer>
  );
};

export default MenuEditor; 