import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State Tracking
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate email login
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('clutch_username', formData.email.split('@')[0]);
      navigate("/dashboard");
    }, 1000);
  };

  const handleGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This tells Google exactly where to send the user back to after signing in
        redirectTo: 'http://localhost:5173/dashboard', 
      },
    });
    
    if (error) throw error;
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    alert("Could not connect to Google: " + error.message);
  }
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
        
        <div className="mb-8 pb-6 border-b border-neutral-800">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <LogIn className="w-6 h-6 text-amber-500 stroke-[2.5]" /> Welcome Back
          </h2>
          <p className="text-sm text-neutral-400 tracking-wide mt-3 font-medium">
            Sign in below to access your workflow dashboard
          </p>
        </div>

        {/* GOOGLE SIGN-IN BUTTON */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-sm font-bold uppercase tracking-wider py-4 rounded-xl transition duration-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.553 0-6.435-2.883-6.435-6.436s2.882-6.435 6.435-6.435c1.593 0 3.042.58 4.162 1.534l3.057-3.057C19.345 2.215 15.993 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.476 0 11.16-4.545 11.16-11.16 0-.756-.067-1.485-.196-2.184H12.24z"
              />
            </svg>
            Continue with Google
          </button>

          {/* VISUAL SEPARATOR */}
          <div className="relative flex items-center justify-center mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <span className="relative px-4 bg-[#141416] text-xs font-bold uppercase tracking-widest text-neutral-500">
              or use email
            </span>
          </div>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-8">
          
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
                placeholder="Enter your password" 
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

          {/* Action Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 font-black text-sm uppercase tracking-widest py-5 rounded-xl transition-all duration-300 mt-8 shadow-lg flex items-center justify-center gap-3 select-none"
          >
            <LogIn className="w-5 h-5 stroke-[2.5]" /> 
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="border-t border-neutral-800 mt-10 pt-8 text-center">
          <p className="text-base text-neutral-400">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-amber-400 font-black hover:text-amber-300 transition tracking-wide border-b-2 border-amber-900/60 pb-1 ml-1">
              Create One Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}