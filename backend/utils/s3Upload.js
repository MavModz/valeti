const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and common document types
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Videos
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and common document types are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files at once
  }
});

/**
 * Upload a single file to S3
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} userId - Admin or subadmin ID
 * @param {string} folder - Optional subfolder within user directory
 * @returns {Promise<Object>} - Upload result with file URL and metadata
 */
const uploadFileToS3 = async (fileBuffer, originalName, mimeType, userId, folder = '') => {
  try {
    // Generate unique filename to prevent conflicts
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(originalName);
    const fileName = `${timestamp}_${randomString}${fileExtension}`;
    
    // Create the S3 key (path) with user ID directory structure
    const userDirectory = `uploads/${userId}`;
    const s3Key = folder ? `${userDirectory}/${folder}/${fileName}` : `${userDirectory}/${fileName}`;
    
    // Determine content type based on file extension
    const contentType = mimeType || getContentType(fileExtension);
    
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make files publicly accessible
      Metadata: {
        originalName: originalName,
        uploadedBy: userId,
        uploadDate: new Date().toISOString()
      }
    };

    const result = await s3.upload(uploadParams).promise();
    
    return {
      success: true,
      fileUrl: result.Location,
      fileKey: result.Key,
      fileName: fileName,
      originalName: originalName,
      contentType: contentType,
      size: fileBuffer.length,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of file objects with buffer, originalname, mimetype
 * @param {string} userId - Admin or subadmin ID
 * @param {string} folder - Optional subfolder within user directory
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleFilesToS3 = async (files, userId, folder = '') => {
  try {
    const uploadPromises = files.map(file => 
      uploadFileToS3(file.buffer, file.originalname, file.mimetype, userId, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple files S3 upload error:', error);
    throw new Error(`Failed to upload multiple files to S3: ${error.message}`);
  }
};

/**
 * Delete a file from S3
 * @param {string} fileKey - The S3 key of the file to delete
 * @returns {Promise<Object>} - Delete result
 */
const deleteFileFromS3 = async (fileKey) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey
    };

    await s3.deleteObject(deleteParams).promise();
    
    return {
      success: true,
      message: 'File deleted successfully',
      fileKey: fileKey
    };
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
};

/**
 * Get file information from S3
 * @param {string} fileKey - The S3 key of the file
 * @returns {Promise<Object>} - File information
 */
const getFileInfoFromS3 = async (fileKey) => {
  try {
    const headParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey
    };

    const result = await s3.headObject(headParams).promise();
    
    return {
      success: true,
      fileKey: fileKey,
      contentType: result.ContentType,
      size: result.ContentLength,
      lastModified: result.LastModified,
      metadata: result.Metadata
    };
  } catch (error) {
    console.error('S3 get file info error:', error);
    throw new Error(`Failed to get file info from S3: ${error.message}`);
  }
};

/**
 * List files in a user's directory
 * @param {string} userId - Admin or subadmin ID
 * @param {string} folder - Optional subfolder within user directory
 * @returns {Promise<Array>} - List of files
 */
const listUserFiles = async (userId, folder = '') => {
  try {
    const userDirectory = `uploads/${userId}`;
    const prefix = folder ? `${userDirectory}/${folder}/` : `${userDirectory}/`;
    
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000
    };

    const result = await s3.listObjectsV2(listParams).promise();
    
    const files = result.Contents.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${item.Key}`
    }));
    
    return {
      success: true,
      files: files,
      count: files.length
    };
  } catch (error) {
    console.error('S3 list files error:', error);
    throw new Error(`Failed to list files from S3: ${error.message}`);
  }
};

/**
 * Get content type based on file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
const getContentType = (extension) => {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/mov',
    '.wmv': 'video/wmv',
    '.flv': 'video/flv',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv'
  };
  
  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Generate a signed URL for temporary file access
 * @param {string} fileKey - The S3 key of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} - Signed URL
 */
const generateSignedUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  } catch (error) {
    console.error('S3 signed URL generation error:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

module.exports = {
  upload,
  uploadFileToS3,
  uploadMultipleFilesToS3,
  deleteFileFromS3,
  getFileInfoFromS3,
  listUserFiles,
  generateSignedUrl,
  getContentType
};
