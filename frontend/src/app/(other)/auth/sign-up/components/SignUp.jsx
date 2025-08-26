'use client';

import logoDark from '@/assets/images/logo-dark.png';
import LogoLight from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import useSignUp from './useSignUp';

const SignUp = () => {
  const { loading, signUp, control, errors } = useSignUp();

  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

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
                <h2 className="fw-bold text-uppercase text-center fs-18">Create Account</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  New to our platform? Sign up now! It only takes a minute.
                </p>
                <div className="px-4">
                  <form onSubmit={signUp} className="authentication-form">
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="firstName" 
                        placeholder="Enter your first name" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="First Name" 
                      />
                      {errors.firstName && (
                        <small className="text-danger">{errors.firstName.message}</small>
                      )}
                    </div>
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="lastName" 
                        placeholder="Enter your last name" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="Last Name" 
                      />
                      {errors.lastName && (
                        <small className="text-danger">{errors.lastName.message}</small>
                      )}
                    </div>
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
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="password" 
                        type="password"
                        placeholder="Enter your password" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="Password" 
                      />
                      {errors.password && (
                        <small className="text-danger">{errors.password.message}</small>
                      )}
                    </div>
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="confirmPassword" 
                        type="password"
                        placeholder="Confirm your password" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="Confirm Password" 
                      />
                      {errors.confirmPassword && (
                        <small className="text-danger">{errors.confirmPassword.message}</small>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="checkbox-signup"
                          {...control.register('termsAccepted')}
                        />
                        <label className="form-check-label" htmlFor="checkbox-signup">
                          I accept Terms and Conditions
                        </label>
                      </div>
                      {errors.termsAccepted && (
                        <small className="text-danger d-block">{errors.termsAccepted.message}</small>
                      )}
                    </div>
                    <div className="mb-1 text-center d-grid">
                      <button 
                        className="btn btn-danger py-2" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                  <p className="mt-3 fw-semibold no-span">OR sign with</p>
                  <div className="text-center">
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="bxl:google" className="fs-20" />
                    </Button>
                    &nbsp;
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="ri:facebook-fill" height={32} width={20} className="" />
                    </Button>
                    &nbsp;
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="bxl:github" className="fs-20" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <p className="mb-0 text-center text-white">
              I already have an account{' '}
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

export default SignUp;