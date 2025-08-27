'use client';

import { useState, useCallback } from 'react';
import { uploadAgentImage } from '@/app/lib/Services/api';

export default function useAgentImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Formats the file size
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  /**
   * Validates file type and size
   */
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type for ${file.name}. Only JPEG, PNG, GIF, WebP, and SVG images are allowed.`);
    }

    if (file.size > maxSize) {
      throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
    }

    return true;
  };

  /**
   * Uploads a single file to S3
   */
  const uploadSingleFile = async (file) => {
    try {
      // Validate file
      validateFile(file);

      // Set uploading state
      console.log('Setting upload progress for:', file.name, 'to uploading');
      setUploadProgress(prev => {
        const updated = {
          ...prev,
          [file.name]: { status: 'uploading', progress: 0 }
        };
        console.log('Updated uploadProgress:', updated);
        return updated;
      });

      // Upload to S3
      const response = await uploadAgentImage(file);
      
      console.log('S3 Upload Response:', response);
      
      if (response.success) {
        // Update progress to completed
        console.log('Setting upload progress for:', file.name, 'to completed');
        setUploadProgress(prev => {
          const updated = {
            ...prev,
            [file.name]: { status: 'completed', progress: 100 }
          };
          console.log('Updated uploadProgress:', updated);
          return updated;
        });

        // Add to uploaded image
        const uploadedImageData = {
          ...response.data,
          originalFile: file,
          uploadedAt: new Date().toISOString()
        };

        console.log('Adding uploaded image:', uploadedImageData);
        setUploadedImage(uploadedImageData);
        
        return uploadedImageData;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      // Update progress to failed
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { status: 'error', progress: 0, error: error.message }
      }));
      throw error;
    }
  };

  /**
   * Handles accepted files and uploads them immediately
   */
  const handleAcceptedFiles = useCallback(async (files, onUploadComplete) => {
    if (!files || files.length === 0) return;

    // For agents, we only allow one image
    const file = files[0];
    
    setIsUploading(true);

    // Process file with preview
    const fileWithPreview = {
      ...file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      formattedSize: formatBytes(file.size),
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Set selected file immediately for preview
    setSelectedFile(fileWithPreview);

    try {
      const result = await uploadSingleFile(file);
      
      // Call callback with results
      if (onUploadComplete) {
        onUploadComplete({
          success: [result],
          errors: [],
          totalFiles: 1,
          successCount: 1,
          errorCount: 0
        });
      }

      return {
        success: [result],
        errors: []
      };
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      
      // Call callback with error
      if (onUploadComplete) {
        onUploadComplete({
          success: [],
          errors: [{ file: file.name, error: error.message }],
          totalFiles: 1,
          successCount: 0,
          errorCount: 1
        });
      }

      return {
        success: [],
        errors: [{ file: file.name, error: error.message }]
      };
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Removes the uploaded image
   */
  const removeFile = useCallback(() => {
    // Remove selected file
    setSelectedFile(null);
    
    // Remove uploaded image
    setUploadedImage(null);
    
    // Clean up progress tracking
    setUploadProgress({});

    // Revoke preview URL to prevent memory leaks
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
  }, [selectedFile]);

  /**
   * Clears all files and uploads
   */
  const clearAllFiles = useCallback(() => {
    // Revoke preview URL
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }

    setSelectedFile(null);
    setUploadedImage(null);
    setUploadProgress({});
    setIsUploading(false);
  }, [selectedFile]);

  /**
   * Gets the upload status for the file
   */
  const getFileUploadStatus = useCallback((fileName) => {
    console.log('getFileUploadStatus called with:', fileName);
    console.log('Current uploadProgress:', uploadProgress);
    const status = uploadProgress[fileName] || { status: 'pending', progress: 0 };
    console.log('Returning status:', status);
    return status;
  }, [uploadProgress]);

  /**
   * Gets the uploaded image URL
   */
  const getUploadedImageUrl = useCallback(() => {
    return uploadedImage?.fileUrl || null;
  }, [uploadedImage]);

  /**
   * Gets the uploaded image data (including metadata)
   */
  const getUploadedImageData = useCallback(() => {
    return uploadedImage;
  }, [uploadedImage]);

  return {
    selectedFile,
    uploadedImage,
    uploadProgress,
    isUploading,
    handleAcceptedFiles,
    removeFile,
    clearAllFiles,
    getFileUploadStatus,
    getUploadedImageUrl,
    getUploadedImageData,
    formatBytes
  };
}
