import { useState } from "react";
import Footer from "../login/footer";
import Header from "../login/header";
import { 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiHelpCircle, 
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle
} from "react-icons/fi";

export default function Support() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on 'Forgot Password' on the login page. We'll send a password reset link to your registered email address."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and popular cryptocurrencies including Bitcoin, Ethereum, and USDT."
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawal processing times vary by method. Cryptocurrency withdrawals typically complete within 30 minutes, while bank transfers may take 1-3 business days."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use bank-grade encryption and security measures to protect all your personal and financial information."
    },
    {
      question: "How can I verify my account?",
      answer: "Account verification requires submitting a government-issued ID and proof of address. You can complete this process in your account settings under 'Verification'."
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="bg-gray-50">
      <Header />
      <div className="min-h-screen p-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Support Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to your questions or contact our support team directly.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Email Support */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email with our dedicated support team</p>
              <a 
                href="mailto:support@cryptoweb.com" 
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                support@cryptoweb.com
              </a>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support agents in real-time</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Start Chat
              </button>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Speak directly with our support specialists</p>
              <a 
                href="tel:+18005551234" 
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                +1 (800) 555-1234
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiHelpCircle className="text-blue-600 mr-2" />
                Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    {activeFaq === index ? (
                      <FiChevronUp className="text-gray-500" />
                    ) : (
                      <FiChevronDown className="text-gray-500" />
                    )}
                  </button>
                  {activeFaq === index && (
                    <div className="mt-4 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Contact Our Support Team</h2>
            </div>
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. Our support team will get back to you within 24 hours.
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <FiClock className="mr-1" /> Typical response time: 2-4 hours
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Help Center
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Community Forum
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                API Documentation
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}