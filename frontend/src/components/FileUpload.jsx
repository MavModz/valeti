import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import PropertyImageDropzone from './from/PropertyImageDropzone';

const FileUpload = ({
  title,
  onUploadComplete,
  onUploadStart,
  onUploadFinish,
  maxFiles = 10,
  disabled = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'}>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <PropertyImageDropzone 
          className="py-5" 
          iconProps={{
            icon: 'bx:cloud-upload',
            height: 48,
            width: 48,
            className: 'mb-4 text-primary'
          }} 
          text="Drop your images here, or click to browse" 
          helpText={
            <span className="text-muted fs-13">
              (1600 x 1200 (4:3) recommended. PNG, JPG, GIF, WebP, and SVG files are allowed. Max 10MB per file)
            </span>
          }
          onUploadComplete={onUploadComplete}
          onUploadStart={onUploadStart}
          onUploadFinish={onUploadFinish}
          maxFiles={maxFiles}
          disabled={disabled}
        />
      </CardBody>
    </Card>
  );
};

export default FileUpload;