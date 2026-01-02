import { useState } from "react";
import Footer from "../login/footer";
import Header from "../login/header";
import { 
  FiMail, 
  FiPhone, 
  FiHelpCircle, 
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiMinus,
  FiSend,
  FiAlertCircle
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/toast";
import { apiClients } from "@/lib/apiClient";

export default function Support() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { showToast, ToastComponent } = useToast();

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on 'Forgot Password' on the login page. We'll send a password reset link to your registered email address."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major cards, bank transfers, PayStack"
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawal processing times vary by method. Cryptocurrency withdrawals typically complete within 2 minutes, while bank transfers may take 5 minutes to several hours depending on your bank."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use bank-grade encryption and security measures to protect all your personal and financial information."
    },
    {
      question: "How can I verify my account?",
      answer: " Your account will be verified immediately you create an account through the right process."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/support/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          skipAuth: true,
          body: JSON.stringify(formData),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setIsSubmitted(true);
      showToast('Message sent successfully! Check your email for confirmation.', 'success');
      
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to send message. Please try again.';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Support form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Header />
      <div className="p-4 pt-24 pb-20 font-grotesk">
        <div className="max-w-6xl mx-auto">
          {/* Support Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-block p-3 bg-blue-500/10 rounded-2xl mb-4">
              <FiHelpCircle className="text-5xl text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get answers to your questions or contact our support team directly.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Email Support */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center hover:bg-gray-800/70 border border-gray-700/50 hover:border-blue-500/50 transition-all hover:scale-105 hover:shadow-blue-500/20">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FiMail className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Email Support</h3>
              <p className="text-gray-400 mb-4 text-sm">Get help via email with our dedicated support team</p>
              <a 
                href="mailto:support@oceanic.com" 
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                oceanictradecharts@gmail.com
              </a>
            </div>
            {/* Live Chat */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center hover:bg-gray-800/70 border border-gray-700/50 hover:border-green-500/50 transition-all hover:shadow-green-500/20">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FaWhatsapp className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">WhatsApp</h3>
              <p className="text-gray-400 mb-4 text-sm">Chat with our support agents in real-time</p>
              <a 
                href="https://wa.me/2348012345678?text=Hi,%20I%20need%20help%20with%20my%20account"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-green-500/30"
              >
                Start Chat
              </a>
            </div>
            {/* Phone Support */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center hover:bg-gray-800/70 border border-gray-700/50 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/20">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FiPhone className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Phone Support</h3>
              <p className="text-gray-400 mb-4 text-sm">Speak directly with our support specialists</p>
              <a 
                href="tel:+18005551234" 
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                +234 (913) 849-7627
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-700/50">
            <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-800/50">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 flex items-center">
                <FiHelpCircle className="text-blue-400 mr-3 text-3xl" />
                Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-y divide-gray-700/50">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="group hover:bg-gray-700/20 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left p-6 focus:outline-none"
                  >
                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400 transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transition-all duration-300 ${
                      activeFaq === index ? 'rotate-180' : 'rotate-0'
                    }`}>
                      {activeFaq === index ? (
                        <FiMinus className="text-white text-lg" />
                      ) : (
                        <FiPlus className="text-white text-lg" />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      <div className="p-4 bg-gray-700/30 rounded-xl border-l-4 border-blue-500">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-800/50">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Contact Our Support Team
              </h2>
            </div>
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
                    <FiCheckCircle className="text-green-400 text-6xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-3">Message Sent!</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Thank you for contacting us. Our support team will get back to you within 10 minutes.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gray-700/50 rounded-xl text-gray-300 border border-gray-600/50">
                    <FiClock className="mr-2 text-blue-400" /> 
                    Typical response time: 5-10 minutes
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your question or issue..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Error message display */}
                  {submitError && (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                      <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-red-300 text-sm">{submitError}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {ToastComponent}
      <Footer />
    </section>
  );
}