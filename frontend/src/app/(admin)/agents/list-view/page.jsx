import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import AgentList from './components/AgentList';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export const metadata = {
  title: 'Agent List'
};

const ListViewPage = () => {
  return <>
      <PageTitle subName="Real Estate" title="Agent List" />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="border-0">
              <Row className="justify-content-between">
                <Col lg={6}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <form className="app-search d-none d-md-block me-auto">
                        <div className="position-relative">
                          <input type="search" className="form-control" placeholder="Search Agent" autoComplete="off" />
                          <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                        </div>
                      </form>
                    </Col>
                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        311 <span className="text-muted"> Agent</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <div className="text-md-end mt-3 mt-md-0">
                    <Link href="/agents/add">
                      <Button variant="success">
                        <IconifyIcon icon="ri:add-line" className="me-1" /> New Agent
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <AgentList />
    </>;
};

export default ListViewPage;