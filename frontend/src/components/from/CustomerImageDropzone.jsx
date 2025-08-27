'use client';

import { Card, Col, FormLabel, FormText, Row, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import useCustomerImageUploader from '@/hooks/useCustomerImageUploader';
import Link from 'next/link';
import IconifyIcon from '../wrappers/IconifyIcon';
import { useState } from 'react';

const CustomerImageDropzone = ({
  label,
  labelClassName,
  helpText,
  iconProps,
  className,
  text,
  textClassName,
  onUploadComplete,
  onUploadStart,
  onUploadFinish,
  disabled = false
}) => {
  const {
    selectedFile,
    uploadedImage,
    uploadProgress,
    isUploading,
    handleAcceptedFiles,
    removeFile,
    getFileUploadStatus,
    getUploadedImageUrl,
    getUploadedImageData
  } = useCustomerImageUploader();

  const [uploadAlert, setUploadAlert] = useState(null);

  // Handle file drop
  const onDrop = async (acceptedFiles) => {
    if (disabled) return;
    
    // For customers, we only allow one image
    if (acceptedFiles.length > 1) {
      setUploadAlert({
        type: 'warning',
        message: 'Only one profile image is allowed. Please select a single image.'
      });
      return;
    }

    setUploadAlert(null);
    
    if (onUploadStart) {
      onUploadStart();
    }

    try {
      const result = await handleAcceptedFiles(acceptedFiles, (uploadResult) => {
        if (uploadResult.errorCount > 0) {
          setUploadAlert({
            type: 'danger',
            message: `Profile image upload failed: ${uploadResult.errors[0].error}`
          });
        } else {
          setUploadAlert({
            type: 'success',
            message: 'Profile image uploaded successfully!'
          });
        }

        // Clear alert after 5 seconds
        setTimeout(() => setUploadAlert(null), 5000);
        
        // Notify parent component about uploaded image
        if (onUploadComplete && uploadResult.success && uploadResult.success.length > 0) {
          const uploadData = {
            url: uploadResult.success[0].fileUrl,
            image: uploadResult.success[0]
          };
          console.log('Calling onUploadComplete with:', uploadData);
          onUploadComplete(uploadData);
        }
      });
      
      // Call onUploadFinish to notify parent that upload process is complete
      if (onUploadFinish) {
        onUploadFinish();
      }
    } catch (error) {
      setUploadAlert({
        type: 'danger',
        message: `Upload failed: ${error.message}`
      });
      
      // Call onUploadFinish even on error to reset loading state
      if (onUploadFinish) {
        onUploadFinish();
      }
    }
  };

  return (
    <>
      {label && <FormLabel className={labelClassName}>{label}</FormLabel>}

      {uploadAlert && (
        <Alert variant={uploadAlert.type} className="mb-3" dismissible onClose={() => setUploadAlert(null)}>
          {uploadAlert.message}
        </Alert>
      )}

      <Dropzone 
        onDrop={onDrop} 
        maxFiles={1}
        disabled={disabled || isUploading}
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
        }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <>
            <div className={`dropzone dropzone-custom ${className} ${isDragActive ? 'border-primary' : ''} ${disabled ? 'disabled' : ''}`}>
              <div className="dz-message" {...getRootProps()}>
                <input {...getInputProps()} />
                <IconifyIcon 
                  icon={iconProps?.icon ?? 'bx:cloud-upload'} 
                  {...iconProps} 
                  className={`${iconProps?.className || ''} ${isUploading ? 'text-muted' : ''}`}
                />
                <h3 className={`${textClassName} ${isUploading ? 'text-muted' : ''}`}>
                  {isUploading ? 'Uploading profile image...' : (isDragActive ? 'Drop image here' : text)}
                </h3>
                {helpText && typeof helpText === 'string' ? (
                  <FormText>{helpText}</FormText>
                ) : (
                  helpText
                )}
                
                {/* Upload progress indicator */}
                {isUploading && (
                  <div className="mt-3">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                    <small className="text-muted">Uploading to cloud storage...</small>
                  </div>
                )}
              </div>
            </div>

            {/* File preview section */}
            {selectedFile && (
              <div className="dz-preview mt-3">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Profile Image
                  </small>
                  {uploadedImage && (
                    <small className="text-success">
                      <IconifyIcon icon="bx:check-circle" className="me-1" />
                      Uploaded to cloud
                    </small>
                  )}
                </div>

                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      {selectedFile.preview ? (
                        <Col xs={'auto'}>
                          <img 
                            data-dz-thumbnail="" 
                            className="avatar-lg rounded bg-light" 
                            alt={selectedFile.name} 
                            src={selectedFile.preview} 
                          />
                        </Col>
                      ) : (
                        <Col xs={'auto'}>
                          <div className="avatar-lg">
                            <span className="avatar-title bg-primary rounded">
                              IMG
                            </span>
                          </div>
                        </Col>
                      )}
                      
                      <Col className="ps-0">
                        <div className="d-flex align-items-center">
                          <Link href="#" className="text-muted fw-bold text-decoration-none">
                            {selectedFile.name}
                          </Link>
                        </div>
                        <p className="mb-0">
                          <strong>{selectedFile.formattedSize}</strong>
                        </p>
                      </Col>
                      
                      <Col className="text-end">
                        <button 
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFile()}
                          disabled={isUploading}
                        >
                          <IconifyIcon icon="bx:trash" />
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </Dropzone>
    </>
  );
};

export default CustomerImageDropzone;
