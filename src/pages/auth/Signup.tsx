import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Github,
  Chrome,
  Building2,
  User
} from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(formData.name, formData.email, formData.password, formData.companyName);
      if (result.success) {
        if (result.needsVerification) {
          setVerificationSent(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1b1b1b] p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d62ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#dd23bb]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NexusCRM</span>
          </Link>
          <p className="mt-2 text-[#868686]">Start your 14-day free trial today</p>
        </div>

        <Card className="border-[#1f1f1f] bg-[#141414]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {verificationSent ? 'Check your email' : 'Create your account'}
            </CardTitle>
            <CardDescription className="text-[#868686]">
              {verificationSent
                ? `We've sent a verification link to ${formData.email}`
                : 'Free 14-day trial • No credit card required'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationSent ? (
              <div className="text-center py-8 space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">Verification link sent!</p>
                  <p className="text-sm text-[#868686]">
                    Please click the link in the email to confirm your account.
                    Check your spam folder if you don't see it.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                >
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#d2d2d2]">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#868686]" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686] focus:border-[#2d62ff] focus:ring-[#2d62ff]/20"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#d2d2d2]">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#868686]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686] focus:border-[#2d62ff] focus:ring-[#2d62ff]/20"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-[#d2d2d2]">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#868686]" />
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686] focus:border-[#2d62ff] focus:ring-[#2d62ff]/20"
                        required
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#d2d2d2]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#868686]" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686] focus:border-[#2d62ff] focus:ring-[#2d62ff]/20"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#868686] hover:text-[#d2d2d2]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#d2d2d2]">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#868686]" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686] focus:border-[#2d62ff] focus:ring-[#2d62ff]/20"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-[#d2d2d2] cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="#" className="text-[#2d62ff] hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="#" className="text-[#2d62ff] hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-[#1f1f1f]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#141414] px-2 text-[#868686]">Or sign up with</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-[#1f1f1f] bg-[#0a0a0a] text-white hover:bg-[#1b1b1b]">
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button variant="outline" className="border-[#1f1f1f] bg-[#0a0a0a] text-white hover:bg-[#1b1b1b]">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-[#868686]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2d62ff] hover:text-[#dd23bb] transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#868686]">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free 14-day trial
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>
    </div>
  );
}
