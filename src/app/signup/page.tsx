import AuthForm from '@/components/auth-form';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen-minus-header py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
