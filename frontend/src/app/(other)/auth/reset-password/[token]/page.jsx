import ResetPasswordWithToken from './components/ResetPasswordWithToken';

export const metadata = {
  title: 'Reset Password'
};

const ResetPasswordWithTokenPage = ({ params }) => {
  return <ResetPasswordWithToken token={params.token} />;
};

export default ResetPasswordWithTokenPage;
