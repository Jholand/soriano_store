import { FaBoxOpen, FaTags, FaCashRegister, FaChartLine, FaUsers, FaCog } from "react-icons/fa";

export default function OurServices() {
  const services = [
    {
      icon: <FaBoxOpen className="text-5xl text-yellow-400 mb-4" />,
      title: "Product Management",
      description: "Comprehensive inventory system to track and manage all your products efficiently. Add, edit, and organize items with ease.",
    },
    {
      icon: <FaTags className="text-5xl text-yellow-400 mb-4" />,
      title: "Category Organization",
      description: "Organize your products into categories for better management and customer experience. Create custom categories to suit your business.",
    },
    {
      icon: <FaCashRegister className="text-5xl text-yellow-400 mb-4" />,
      title: "Point of Sale (POS)",
      description: "Fast and efficient checkout system for both admin and staff. Process transactions quickly with our intuitive POS interface.",
    },
    {
      icon: <FaChartLine className="text-5xl text-yellow-400 mb-4" />,
      title: "Sales Monitoring",
      description: "Real-time sales tracking and analytics. Monitor your business performance with detailed reports and insights.",
    },
    {
      icon: <FaUsers className="text-5xl text-yellow-400 mb-4" />,
      title: "Staff Management",
      description: "Manage your team members with role-based access control. Add, edit, and monitor staff activities securely.",
    },
    {
      icon: <FaCog className="text-5xl text-yellow-400 mb-4" />,
      title: "System Settings",
      description: "Customize your store settings and preferences. Configure the system to match your business requirements.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">What We Offer</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Our Services
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          Comprehensive solutions for your store management needs. Everything you need to run your business efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/10 transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-10 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Why Choose RaiLyn's Store System?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto text-sm">
              Our store management system is designed to streamline your business operations. 
              With an intuitive interface and powerful features, you can focus on growing your business 
              while we handle the technical complexities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "User-Friendly", icon: "✓" },
                { label: "Secure", icon: "✓" },
                { label: "Real-Time Updates", icon: "✓" },
                { label: "Role-Based Access", icon: "✓" },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-center hover:border-yellow-400/50 transition-all duration-300">
                  <div className="text-yellow-400 text-xl mb-2">{feature.icon}</div>
                  <p className="text-white font-semibold text-sm">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
