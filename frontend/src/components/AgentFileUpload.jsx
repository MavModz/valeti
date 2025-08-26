import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import AgentImageDropzone from './from/AgentImageDropzone';

const AgentFileUpload = ({
  title,
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
        <AgentImageDropzone 
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

export default AgentFileUpload;
