
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

import Image from "next/image";
import img from '../../public/Images/blogp.png'
const testimonials = [
  {
    id: 1,
    name: "Alice Carter",
    role: "Crypto Investor",
    image: img,
    text: "This platform has completely transformed the way I invest in crypto. The analytics and insights are top-notch!",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Blockchain Developer",
    image: img,
    text: "The security and transparency of this crypto project are outstanding. It's a game-changer for the industry!",
  },
  {
    id: 3,
    name: "Sophia Williams",
    role: "DeFi Enthusiast",
    image: img,
    text: "The seamless transactions and user-friendly interface make this my go-to crypto platform!",
  },
];

export default function TestimonialSection() {
  return (
    <div className="py-12 pb-20 text-center font-grotesk">
      <h2 className="lg:text-2xl text-md text-grotesk font-bold mb-6">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {testimonials.map((testimonial) => (
          <div
          key={testimonial.id}
            className="p-6 bg-white shadow-xl rounded-2xl relative"
          >
            <FaQuoteLeft className="absolute top-4 left-4 text-gray-300 text-md" />
            <p className="text-gray-700 text-md italic px-4">{testimonial.text}</p>
            <div className="mt-4 flex flex-col items-center">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={20}
                height={20}
                className="w-16 h-16 rounded-full shadow-lg"
              />
              <h4 className="font-semibold text-sm mt-2">{testimonial.name}</h4>

            </div>
            <FaQuoteRight className="absolute bottom-4 right-4 text-gray-300 text-md" />
          </div>
        ))}
      </div>
    </div>
      );
    }