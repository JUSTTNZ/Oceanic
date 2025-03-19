"use client"
const LoginPage = () => {
  return (

    
      <div className="flex justify-center items-center min-h-screen pt-10 pb-10 bg-[#f7f7fa]">
        <div className="bg-white p-8 px-10  w-[600px]  p-0 bg-white border border-[#D5D2E5] border-opacity-80 rounded-[5px] shadow-[0_0px_30px_5px_rgba(32,23,73,0.05)]">
          <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5C3D90"  // Adjust color if needed
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-20 h-20"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
            <rect x="8" y="14" width="8" height="2" rx="1" />
          </svg>
        </div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-gray-600">Please check that you are visiting the correct URL</p>
            <div className="border border-[#D5D2E5] rounded-full inline-block">
  <p className="text-green-600 font-semibold m-0 p-2">
    https://app.quidax.io/signin
  </p>
</div>
         
          </div>

          <form>
            <label className="font-sans text-base font-medium block mb-2">E-mail Address *</label>
            <input
              type="email"
              className="w-full p-3 border border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="E-mail Address"
            />

            <label className="block mb-2 font-medium">Password *</label>
            <input
              type="password"
              className="w-full p-3 border border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Password"
            />

       

            <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold">Sign In</button>
          </form>

          <div className="text-center flex justify-between mt-4">
            <a href="#" className="text-red-600">Forgot Password?</a>
            <p className="mt-2">
              Not signed up yet? <a href="#" className="text-purple-600">Create Account</a>
            </p>
          </div>
        </div>
      </div>
 
  );
};

export default LoginPage;
