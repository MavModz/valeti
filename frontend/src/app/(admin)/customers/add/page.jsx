import PageTitle from '@/components/PageTitle';
import CustomerAddWrapper from './components/CustomerAddWrapper';

export const metadata = {
  title: 'Customers Add'
};

const CustomerAddPage = () => {
  return <>
      <PageTitle title="Customers Add" subName="Real Estate" />
      <CustomerAddWrapper />
    </>;
};

export default CustomerAddPage;