import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Get In Touch</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Contact Us
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          We'd love to hear from you. Reach out and let's connect!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
              <input 
                type="text"
                className="w-full p-4 rounded-xl bg-white border border-gray-200 text-white placeholder-gray-500 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300" 
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
              <input 
                type="email"
                className="w-full p-4 rounded-xl bg-white border border-gray-200 text-white placeholder-gray-500 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300" 
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Your Message</label>
              <textarea 
                rows="5"
                className="w-full p-4 rounded-xl bg-white border border-gray-200 text-white placeholder-gray-500 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 resize-none" 
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-yellow-400 text-black font-semibold tracking-wide shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-400/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-400/10 rounded-xl">
                  <FaEnvelope className="text-xl text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-400">contact@railynsstore.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-400/10 rounded-xl">
                  <FaPhone className="text-xl text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">+63 123 456 7890</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-400/10 rounded-xl">
                  <FaMapMarkerAlt className="text-xl text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Location</h4>
                  <p className="text-gray-400">Manila, Philippines</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-4">Business Hours</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-yellow-400 font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-yellow-400 font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-500 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
