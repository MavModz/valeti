import PageTitle from '@/components/PageTitle';
import PropertyList from './components/PropertyList';
import PropertyStat from './components/PropertyStat';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

export const metadata = {
  title: 'Listing List'
};

const PropertyListPage = () => {
  return <>
      <PageTitle title="Listing List" subName="Real Estate" />
      <div className="d-flex justify-content-end mb-3">
        <Link href="/property/add">
          <Button variant="primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add New Property
          </Button>
        </Link>
      </div>
      <PropertyStat />
      <PropertyList />
    </>;
};

export default PropertyListPage;