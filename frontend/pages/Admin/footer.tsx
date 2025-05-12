
export default function Footer() {
  return (
    <footer className=" bg-gradient-to-b from-blue-600 to-blue-700 text-white py-6 border-t border-gray-900 font-grotesk text-sm">
      <div className="container mx-auto px-6 flex flex-col items-center text-gray-600 text-sm space-y-4 lg:space-y-0 lg:flex-row lg:justify-between">
        
       
        <p className="text-center text-white lg:text-left">©{new Date().getFullYear()} Oceanic. All Rights Reserved.</p>

       

        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600 text-white">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 text-white">Terms of Use</a>

        </div>

      </div>
    </footer>
  );
}
