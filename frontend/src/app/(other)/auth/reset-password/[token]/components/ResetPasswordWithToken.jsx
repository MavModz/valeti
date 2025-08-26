'use client';

import logoDark from '@/assets/images/logo-dark.png';
import LogoLight from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import { resetPassword } from '@/app/lib/Services/api';
import { useRouter } from 'next/navigation';

const ResetPasswordWithToken = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { showNotification } = useNotificationContext();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  const resetPasswordSchema = yup.object({
    password: yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match')
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const handleResetPassword = handleSubmit(async (values) => {
    setLoading(true);
    
    try {
      const response = await resetPassword(token, values.password);

      if (response.success) {
        setSuccess(true);
        showNotification({
          message: 'Password reset successfully! You can now sign in with your new password.',
          variant: 'success'
        });
      } else {
        showNotification({
          message: response.message || 'Failed to reset password. Please try again.',
          variant: 'danger'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.message?.includes('invalid') || error.message?.includes('expired')) {
        setTokenValid(false);
      }
      showNotification({
        message: error.message || 'Failed to reset password. Please try again.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  const goToSignIn = () => {
    router.push('/auth/sign-in');
  };

  if (!tokenValid) {
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
                      icon="solar:lock-keyhole-broken" 
                      className="text-danger mb-3" 
                      style={{ fontSize: '4rem' }} 
                    />
                    <h2 className="fw-bold text-uppercase text-center fs-18">Invalid or Expired Link</h2>
                    <p className="text-muted text-center mt-1 mb-4">
                      The password reset link is invalid or has expired. 
                      Please request a new password reset link.
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

  if (success) {
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
                      icon="solar:check-circle-broken" 
                      className="text-success mb-3" 
                      style={{ fontSize: '4rem' }} 
                    />
                    <h2 className="fw-bold text-uppercase text-center fs-18">Password Reset Successfully</h2>
                    <p className="text-muted text-center mt-1 mb-4">
                      Your password has been reset successfully. 
                      You can now sign in with your new password.
                    </p>
                    <Button 
                      variant="primary" 
                      className="w-100 py-2" 
                      onClick={goToSignIn}
                    >
                      Sign In
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
                <h2 className="fw-bold text-uppercase text-center fs-18">Set New Password</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  Enter your new password below.
                </p>
                <div className="px-4">
                  <form onSubmit={handleResetPassword} className="authentication-form">
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="password" 
                        type="password"
                        placeholder="Enter your new password" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="New Password" 
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
                        placeholder="Confirm your new password" 
                        className="bg-light bg-opacity-50 border-light py-2" 
                        label="Confirm New Password" 
                      />
                      {errors.confirmPassword && (
                        <small className="text-danger">{errors.confirmPassword.message}</small>
                      )}
                    </div>
                    <div className="mb-1 text-center d-grid">
                      <button 
                        className="btn btn-danger py-2 fw-medium" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordWithToken;
