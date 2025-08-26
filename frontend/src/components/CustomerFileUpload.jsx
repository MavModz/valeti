import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import CustomerImageDropzone from './from/CustomerImageDropzone';

const CustomerFileUpload = ({
  title = "Add Customer Photo",
  onUploadComplete,
  onUploadStart,
  onUploadFinish,
  disabled = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'}>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <CustomerImageDropzone 
          className="py-5" 
          iconProps={{
            icon: 'bx:cloud-upload',
            height: 48,
            width: 48,
            className: 'mb-4 text-primary'
          }} 
          text="Drop your profile image here, or click to browse" 
          helpText={
            <span className="text-muted fs-13">
              (Square image recommended. PNG, JPG, GIF, WebP, and SVG files are allowed. Max 10MB)
            </span>
          }
          onUploadComplete={onUploadComplete}
          onUploadStart={onUploadStart}
          onUploadFinish={onUploadFinish}
          disabled={disabled}
        />
      </CardBody>
    </Card>
  );
};

export default CustomerFileUpload;
