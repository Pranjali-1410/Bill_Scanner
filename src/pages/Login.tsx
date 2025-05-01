
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import KPMGLogo from '@/components/KPMGLogo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Simple validation
      if (!username || !password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // For demo purposes - normally would validate with a real backend
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-layout">
      <div className="auth-side">
        <KPMGLogo />
      </div>
      <div className="auth-form-side">
        <div className="auth-form">
          <h1 className="auth-heading">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-link text-sm">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Not a Member? </span>
              <Link to="/register" className="text-link">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
