import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';
import PropertiesData from './components/PropertiesData';
import PropertiesFilter from './components/PropertiesFilter';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

export const metadata = {
  title: 'Listing Grid'
};

const PropertyGridPage = () => {
  return <>
      <PageTitle title="Listing Grid" subName="Real Estate" />
      <div className="d-flex justify-content-end mb-3">
        <Link href="/property/add">
          <Button variant="primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add New Property
          </Button>
        </Link>
      </div>
      <Row>
        <PropertiesFilter />
        <PropertiesData />
      </Row>
    </>;
};

export default PropertyGridPage;