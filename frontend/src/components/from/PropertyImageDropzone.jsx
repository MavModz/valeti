'use client';

import { Card, Col, FormLabel, FormText, Row, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import usePropertyImageUploader from '@/hooks/usePropertyImageUploader';
import Link from 'next/link';
import IconifyIcon from '../wrappers/IconifyIcon';
import { useState, useEffect } from 'react';

const PropertyImageDropzone = ({
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
  maxFiles = 10,
  disabled = false
}) => {
  const {
    selectedFiles,
    uploadedImages,
    uploadProgress,
    isUploading,
    handleAcceptedFiles,
    removeFile,
    getUploadedImageUrls,
    getUploadedImagesData
  } = usePropertyImageUploader();

  const [uploadAlert, setUploadAlert] = useState(null);

  // Handle file drop
  const onDrop = async (acceptedFiles) => {
    if (disabled) return;
    
    // Check max files limit
    const totalFiles = selectedFiles.length + acceptedFiles.length;
    if (totalFiles > maxFiles) {
      setUploadAlert({
        type: 'warning',
        message: `Maximum ${maxFiles} files allowed. Please remove some files first.`
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
            message: `${uploadResult.errorCount} file(s) failed to upload. ${uploadResult.successCount} file(s) uploaded successfully.`
          });
        } else {
          setUploadAlert({
            type: 'success',
            message: `${uploadResult.successCount} file(s) uploaded successfully!`
          });
        }

        // Clear alert after 5 seconds
        setTimeout(() => setUploadAlert(null), 5000);
        
        // Notify parent component about uploaded images
        if (onUploadComplete && uploadResult.success && uploadResult.success.length > 0) {
          const uploadData = {
            urls: uploadResult.success.map(img => img.fileUrl),
            images: uploadResult.success
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
        maxFiles={maxFiles}
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
                  {isUploading ? 'Uploading files...' : (isDragActive ? 'Drop files here' : text)}
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
            {selectedFiles.length > 0 && (
              <div className="dz-preview mt-3">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {uploadedImages.length}/{selectedFiles.length} files uploaded
                  </small>
                  {uploadedImages.length > 0 && (
                    <small className="text-success">
                      <IconifyIcon icon="bx:check-circle" className="me-1" />
                      {uploadedImages.length} uploaded to cloud
                    </small>
                  )}
                </div>

                {selectedFiles.filter(file => file && typeof file === 'object').map((file, idx) => {

                  // Safely get file extension with fallback
                  const getFileExtension = (fileName) => {
                    if (!fileName || typeof fileName !== 'string') return 'FILE';
                    const lastDotIndex = fileName.lastIndexOf('.');
                    return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1).toUpperCase() : 'FILE';
                  };
                  
                  const ext = getFileExtension(file.name);
                  const fileName = file.name || `File ${idx + 1}`;
                  const fileSize = file.formattedSize || 'Unknown size';
                  
                  return (
                    <Card className="mt-1 mb-0 shadow-none border" key={file.id || `${idx}-file`}>
                      <div className="p-2">
                        <Row className="align-items-center">
                          {file.preview ? (
                            <Col xs={'auto'}>
                              <img 
                                data-dz-thumbnail="" 
                                className="avatar-sm rounded bg-light" 
                                alt={fileName} 
                                src={file.preview} 
                              />
                            </Col>
                          ) : (
                            <Col xs={'auto'}>
                              <div className="avatar-sm">
                                <span className="avatar-title bg-primary rounded">
                                  {ext}
                                </span>
                              </div>
                            </Col>
                          )}
                          
                          <Col className="ps-0">
                                                         <div className="d-flex align-items-center">
                               <Link href="#" className="text-muted fw-bold text-decoration-none">
                                 {fileName}
                               </Link>
                             </div>
                                                         <p className="mb-0">
                               <strong>{fileSize}</strong>
                             </p>
                          </Col>
                          
                          <Col className="text-end">
                                                         <button 
                               type="button"
                               className="btn btn-sm btn-outline-danger"
                               onClick={() => removeFile(file)}
                               disabled={isUploading}
                             >
                              <IconifyIcon icon="bx:trash" />
                            </button>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Dropzone>
    </>
  );
};

export default PropertyImageDropzone;
