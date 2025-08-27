'use client';

import { useState, useCallback } from 'react';
import { uploadPropertyImage } from '@/app/lib/Services/api';

export default function usePropertyImageUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
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
      const response = await uploadPropertyImage(file);
      
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

        // Add to uploaded images
        const uploadedImage = {
          ...response.data,
          originalFile: file,
          uploadedAt: new Date().toISOString()
        };

        console.log('Adding uploaded image:', uploadedImage);
        setUploadedImages(prev => [...prev, uploadedImage]);
        
        return uploadedImage;
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

    setIsUploading(true);

    // Process files with preview
    const filesWithPreview = files.map(file => ({
      ...file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      formattedSize: formatBytes(file.size),
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    // Add to selected files immediately for preview
    setSelectedFiles(prev => [...prev, ...filesWithPreview]);

    // Upload files one by one
    const uploadResults = [];
    const uploadErrors = [];

    for (const file of files) {
      try {
        const result = await uploadSingleFile(file);
        uploadResults.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        uploadErrors.push({ file: file.name, error: error.message });
      }
    }

    setIsUploading(false);

    // Call callback with results
    if (onUploadComplete) {
      onUploadComplete({
        success: uploadResults,
        errors: uploadErrors,
        totalFiles: files.length,
        successCount: uploadResults.length,
        errorCount: uploadErrors.length
      });
    }

    return {
      success: uploadResults,
      errors: uploadErrors
    };
  }, []);

  /**
   * Removes a file from the selected files and uploaded images
   */
  const removeFile = useCallback((file) => {
    console.log('Removing file:', file);
    
    // Remove from selected files using unique ID
    setSelectedFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id);
      console.log('Selected files after removal:', filtered);
      return filtered;
    });
    
    // Remove from uploaded images if it exists (using originalFile name as fallback)
    setUploadedImages(prev => {
      const filtered = prev.filter(img => {
        // If the file has an originalFile, use that for comparison
        if (img.originalFile) {
          return img.originalFile.name !== file.name;
        }
        // Otherwise, this shouldn't happen but just in case
        return true;
      });
      console.log('Uploaded images after removal:', filtered);
      return filtered;
    });
    
    // Clean up progress tracking
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[file.name];
      console.log('Upload progress after removal:', updated);
      return updated;
    });

    // Revoke preview URL to prevent memory leaks
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  }, []);

  /**
   * Clears all files and uploads
   */
  const clearAllFiles = useCallback(() => {
    // Revoke all preview URLs
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setSelectedFiles([]);
    setUploadedImages([]);
    setUploadProgress({});
    setIsUploading(false);
  }, [selectedFiles]);

  /**
   * Gets the upload status for a specific file
   */
  const getFileUploadStatus = useCallback((fileName) => {
    console.log('getFileUploadStatus called with:', fileName);
    console.log('Current uploadProgress:', uploadProgress);
    const status = uploadProgress[fileName] || { status: 'pending', progress: 0 };
    console.log('Returning status:', status);
    return status;
  }, [uploadProgress]);

  /**
   * Gets all successfully uploaded image URLs
   */
  const getUploadedImageUrls = useCallback(() => {
    return uploadedImages.map(img => img.fileUrl);
  }, [uploadedImages]);

  /**
   * Gets all uploaded image data (including metadata)
   */
  const getUploadedImagesData = useCallback(() => {
    return uploadedImages;
  }, [uploadedImages]);

  return {
    selectedFiles,
    uploadedImages,
    uploadProgress,
    isUploading,
    handleAcceptedFiles,
    removeFile,
    clearAllFiles,
    getFileUploadStatus,
    getUploadedImageUrls,
    getUploadedImagesData,
    formatBytes
  };
}
