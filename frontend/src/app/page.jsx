import Link from 'next/link';
import Image from 'next/image';
import logoDark from '@/assets/images/logo-dark.png';

export default function HomePage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 text-center">
            {/* Logo */}
            <div className="mb-5">
              <Image 
                alt="Logo" 
                width={200} 
                height={50} 
                src={logoDark} 
                className="mx-auto"
                priority 
              />
            </div>

            {/* Main Content */}
            <h1 className="display-3 fw-bold text-dark mb-4">
              Welcome to Lahomes
            </h1>
            <p className="lead text-muted mb-5">
              A fully responsive premium admin dashboard template for Real Estate Management. 
              Streamline your property operations with our comprehensive admin panel.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-5">
              <Link 
                href="/dashboards/analytics" 
                className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold shadow"
              >
                Sign In
              </Link>
            </div>

            {/* Features Grid */}
            <div className="row g-4 mt-5">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">Analytics Dashboard</h5>
                    <p className="text-muted mb-0">Comprehensive insights and metrics for your real estate business</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-0 shadow">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">User Management</h5>
                    <p className="text-muted mb-0">Efficiently manage agents, customers, and team members</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-0 shadow">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">Property Management</h5>
                    <p className="text-muted mb-0">Complete property listing and management system</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-top">
              <p className="text-muted mb-0">
                © 2024 Lahomes. All rights reserved. Premium Real Estate Management Admin Template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
