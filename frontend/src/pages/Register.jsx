import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle, Eye, EyeOff, UserPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State Tracking
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate account setup delay
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('clutch_username', formData.username);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans antialiased relative flex flex-col justify-center items-center px-6 py-12 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-950/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 mb-10 relative z-10 group scale-125">
        <span className="text-amber-500 font-black text-3xl tracking-tighter">//</span>
        <span className="text-3xl font-black tracking-widest text-white uppercase">
          CLUTCH<span className="text-amber-500">.</span>
        </span>
      </Link>

      {/* Expanded Container Box */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-neutral-900/80 to-neutral-900/30 border border-neutral-700 p-12 sm:p-16 rounded-2xl backdrop-blur-xl relative z-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        <div className="mb-10 pb-6 border-b border-neutral-800">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-amber-500 stroke-[2.5]" /> Create Your Account
          </h2>
          <p className="text-sm text-neutral-400 tracking-wide mt-3 font-medium">
            Sign up below to start managing your daily workflows
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-8">
          
          {/* USERNAME INPUT */}
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-300 block">
              Username
            </label>
            <input 
              type="text" 
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="e.g., Alex Mercer" 
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 p-5 rounded-xl text-base text-white placeholder-neutral-600 outline-none transition"
            />
          </div>

          {/* EMAIL INPUT */}
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-300 block">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com" 
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 p-5 rounded-xl text-base text-white placeholder-neutral-600 outline-none transition"
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-3 relative">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-300 block">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password" 
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 p-5 pr-14 rounded-xl text-base text-white placeholder-neutral-600 outline-none transition"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition scale-110"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Huge Action Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 font-black text-sm uppercase tracking-widest py-5 rounded-xl transition-all duration-300 mt-8 shadow-lg flex items-center justify-center gap-3 select-none"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" /> 
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="border-t border-neutral-800 mt-10 pt-8 text-center">
          <p className="text-base text-neutral-400">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-400 font-black hover:text-amber-300 transition tracking-wide border-b-2 border-amber-900/60 pb-1 ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}