
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import KPMGLogo from '@/components/KPMGLogo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    kpmgId: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Simple validation
      const allFieldsFilled = Object.values(formData).every(field => field !== '');
      if (!allFieldsFilled) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // For demo purposes - normally would register with a real backend
      toast({
        title: "Success",
        description: "Registration initiated",
      });
      navigate('/otp-verification');
    }, 1000);
  };

  return (
    <div className="auth-layout">
      <div className="auth-side">
        <KPMGLogo />
      </div>
      <div className="auth-form-side">
        <div className="auth-form">
          <h1 className="auth-heading">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="designation" className="form-label">Designation</label>
              <input
                id="designation"
                name="designation"
                type="text"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="department" className="form-label">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="kpmgId" className="form-label">KPMG ID</label>
              <input
                id="kpmgId"
                name="kpmgId"
                type="text"
                className="form-input"
                value={formData.kpmgId}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Generate OTP'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Already have a Account? </span>
              <Link to="/login" className="text-link">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
