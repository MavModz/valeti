import PageTitle from '@/components/PageTitle';
import PropertyAddWrapper from './components/PropertyAddWrapper';

export const metadata = {
  title: 'Add Property'
};

const PropertyAddPage = () => {
  return <>
      <PageTitle title="Add Property" subName="Real Estate" />
      <PropertyAddWrapper />
    </>;
};

export default PropertyAddPage;