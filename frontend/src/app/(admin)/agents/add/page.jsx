import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import AgentAddWrapper from './components/AgentAddWrapper';

export const metadata = {
  title: 'Add Agent'
};

const AgentAddPage = () => {
  return <>
      <PageTitle subName="Real Estate" title="Add Agent" />
      <AgentAddWrapper />
    </>;
};

export default AgentAddPage;