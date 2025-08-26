'use client';

import logoDark from '@/assets/images/logo-dark.png';
import LogoLight from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import useResetPassword from './useResetPassword';

const ResetPassword = () => {
  const { loading, emailSent, resetPassword, goToSignIn, control, errors } = useResetPassword();

  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  if (emailSent) {
    return (
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col xl={5}>
              <Card className="auth-card">
                <CardBody className="px-3 py-5">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <Link href="/dashboards/analytics" className="logo-dark">
                      <Image src={logoDark} height={32} alt="logo dark" />
                    </Link>
                    <Link href="/dashboards/analytics" className="logo-light">
                      <Image src={LogoLight} height={28} alt="logo light" />
                    </Link>
                  </div>
                  <div className="text-center">
                    <IconifyIcon 
                      icon="solar:letter-broken" 
                      className="text-success mb-3" 
                      style={{ fontSize: '4rem' }} 
                    />
                    <h2 className="fw-bold text-uppercase text-center fs-18">Check Your Email</h2>
                    <p className="text-muted text-center mt-1 mb-4">
                      We've sent a password reset link to your email address. 
                      Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <Button 
                      variant="primary" 
                      className="w-100 py-2" 
                      onClick={goToSignIn}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <Link href="/dashboards/analytics" className="logo-dark">
                    <Image src={logoDark} height={32} alt="logo dark" />
                  </Link>
                  <Link href="/dashboards/analytics" className="logo-light">
                    <Image src={LogoLight} height={28} alt="logo light" />
                  </Link>
                </div>
                <h2 className="fw-bold text-uppercase text-center fs-18">Reset Password</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  Enter your email address and we&apos;ll send you an email with instructions <br /> 
                  to reset your password.
                </p>
                <div className="px-4">
                  <form onSubmit={resetPassword} className="authentication-form">
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="email" 
                        placeholder="Enter your email" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="Email" 
                      />
                      {errors.email && (
                        <small className="text-danger">{errors.email.message}</small>
                      )}
                    </div>
                    <div className="mb-1 text-center d-grid">
                      <button 
                        className="btn btn-danger py-2 fw-medium" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
            <p className="mb-0 text-center text-white">
              Back to{' '}
              <Link href="/auth/sign-in" className="text-reset text-unline-dashed fw-bold ms-1">
                Sign In
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;