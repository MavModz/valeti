import avatar2 from '@/assets/images/users/avatar-2.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import { Card, CardBody, Col } from 'react-bootstrap';

const AgentAddCard = ({ formData, city, country, uploadedImage = null, isLoading = false }) => {
  // Default values for preview
  const previewData = {
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    phoneNumber: formData?.phoneNumber || '',
    description: formData?.description || '',
    propertiesNumber: formData?.propertiesNumber || 0,
    zipCode: formData?.zipCode || '',
    facebookUrl: formData?.facebookUrl || '',
    instagramUrl: formData?.instagramUrl || '',
    twitterUrl: formData?.twitterUrl || ''
  };

  // Generate full name
  const fullName = `${previewData.firstName} ${previewData.lastName}`.trim() || 'New Agent';
  
  // Generate address
  const address = [previewData.zipCode, city, country].filter(Boolean).join(', ') || 'Address will appear here';
  
  // Check if any social media is provided
  const hasSocialMedia = previewData.facebookUrl || previewData.instagramUrl || previewData.twitterUrl;

  // Get the profile image
  const profileImageSrc = uploadedImage?.fileUrl || avatar2;
  const profileImageAlt = uploadedImage?.originalName || 'Agent Avatar';

  return (
    <Col xl={3} lg={4}>
      <Card className={isLoading ? 'opacity-75' : ''}>
        <CardBody>
          {isLoading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="d-flex align-items-center gap-2 border-bottom pb-3">
            <div className="position-relative">
              {isLoading && !uploadedImage && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-3" style={{ zIndex: 10 }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <Image 
                src={profileImageSrc} 
                alt={profileImageAlt} 
                className="avatar-lg rounded-3 border border-light border-3" 
                width={80}
                height={80}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to default avatar if uploaded image fails to load
                  e.target.src = avatar2;
                }}
              />
              {uploadedImage && (
                <span className="position-absolute top-0 end-0 p-1">
                  <span className="badge bg-success text-light fs-10">
                    ✓
                  </span>
                </span>
              )}
            </div>
            <div className="d-block">
              <h6 className={`fw-medium fs-16 mb-1 ${fullName !== 'New Agent' ? 'text-dark' : 'text-muted'}`}>
                {fullName}
              </h6>
              <p className={`mb-0 ${previewData.email ? 'text-dark' : 'text-muted'}`}>
                {previewData.email || 'Email will appear here'}
              </p>
              <p className="mb-0 text-primary">
                {previewData.email ? `# ${previewData.firstName || 'Agent'}` : '# New Agent'}
              </p>
            </div>
          </div>
          
          <p className="mt-3 d-flex align-items-center gap-2 mb-2">
            <IconifyIcon icon="solar:home-bold-duotone" className="fs-18 text-primary" />
            {previewData.propertiesNumber} Properties
          </p>
          
          <p className="d-flex align-items-center gap-2 mt-2">
            <IconifyIcon icon="solar:map-point-wave-bold-duotone" className="fs-18 text-primary" />
            <span className={address !== 'Address will appear here' ? 'text-dark' : 'text-muted'}>
              {address}
            </span>
          </p>
          
          {previewData.description && (
            <p className="d-flex align-items-center gap-2 mt-2">
              <IconifyIcon icon="solar:document-text-bold-duotone" className="fs-18 text-primary" />
              <span className="text-muted small">
                {previewData.description.length > 50 
                  ? `${previewData.description.substring(0, 50)}...` 
                  : previewData.description
                }
              </span>
            </p>
          )}
          
          {previewData.phoneNumber && (
            <p className="d-flex align-items-center gap-2 mt-2">
              <IconifyIcon icon="solar:phone-bold-duotone" className="fs-18 text-primary" />
              {previewData.phoneNumber}
            </p>
          )}
          
          <h5 className="my-3">Social Media :</h5>
          <ul className="list-inline d-flex gap-1 mb-0 align-items-center">
            <li className="list-inline-item">
              <span className={`btn avatar-sm d-flex align-items-center justify-content-center ${
                previewData.facebookUrl ? 'btn-soft-primary' : 'btn-soft-secondary opacity-50'
              }`}>
                <span>
                  <IconifyIcon width={20} height={20} icon="ri:facebook-fill" />
                </span>
              </span>
            </li>
            <li className="list-inline-item">
              <span className={`btn avatar-sm d-flex align-items-center justify-content-center ${
                previewData.instagramUrl ? 'btn-soft-danger' : 'btn-soft-secondary opacity-50'
              }`}>
                <span>
                  <IconifyIcon width={20} height={20} icon="ri:instagram-line" />
                </span>
              </span>
            </li>
            <li className="list-inline-item">
              <span className={`btn avatar-sm d-flex align-items-center justify-content-center ${
                previewData.twitterUrl ? 'btn-soft-info' : 'btn-soft-secondary opacity-50'
              }`}>
                <span>
                  <IconifyIcon width={20} height={20} icon="ri:twitter-line" />
                </span>
              </span>
            </li>
            <li className="list-inline-item">
              <span className="btn btn-soft-success avatar-sm d-flex align-items-center justify-content-center">
                <span>
                  <IconifyIcon width={20} height={20} icon="ri:whatsapp-line" />
                </span>
              </span>
            </li>
            <li className="list-inline-item">
              <span className="btn btn-soft-warning avatar-sm d-flex align-items-center justify-content-center">
                <span>
                  <IconifyIcon width={20} height={20} icon="ri:mail-line" />
                </span>
              </span>
            </li>
          </ul>
          
          {hasSocialMedia && (
            <div className="mt-3">
              <small className="text-muted">
                Social media links: {[
                  previewData.facebookUrl && 'Facebook',
                  previewData.instagramUrl && 'Instagram', 
                  previewData.twitterUrl && 'Twitter'
                ].filter(Boolean).join(', ')}
              </small>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Form Progress</small>
              <small className="text-primary">
                {[
                  previewData.firstName && previewData.lastName,
                  previewData.email,
                  previewData.phoneNumber,
                  previewData.description,
                  previewData.zipCode && city && country
                ].filter(Boolean).length}/5
              </small>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: `${([
                    previewData.firstName && previewData.lastName,
                    previewData.email,
                    previewData.phoneNumber,
                    previewData.description,
                    previewData.zipCode && city && country
                  ].filter(Boolean).length / 5) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AgentAddCard;