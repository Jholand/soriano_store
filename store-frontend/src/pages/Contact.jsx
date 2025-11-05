export default function Contact() {
  return (
    <div className="p-10 max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-yellow-400 mb-6 drop-shadow-[0_0_6px_#FFD70030]">
        Contact RaiLyn Store
      </h2>
      <p className="text-gray-300 mb-6">We’d love to hear from you. Reach out and let’s connect!</p>

      <form className="bg-white/10 backdrop-blur-lg border border-yellow-500/20 p-8 rounded-2xl shadow-[0_0_10px_#FFD70020] hover:shadow-[0_0_20px_#FFD70040] transition-all duration-500">
        <input className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Your Name" />
        <input className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Your Email" />
        <textarea className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none" rows="4" placeholder="Your Message"></textarea>
        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold hover:shadow-[0_0_15px_#FFD70040] transition-all duration-300">
          Send Message
        </button>
      </form>
    </div>
  );
}
