export default function About() {
  return (
    <div className="p-10 max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-yellow-400 mb-6 drop-shadow-[0_0_6px_#FFD70030]">
        About RaiLyn Store
      </h2>
      <p className="text-gray-700 mb-10 leading-relaxed">
        RaiLyn Store was founded with the belief that elegance and quality should be accessible to everyone.
        We’re not just a brand — we’re a lifestyle. Every item we offer is selected to match the sophistication you deserve.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Mission", text: "Deliver royal-quality goods with passion and precision." },
          { title: "Vision", text: "To be the Philippines’ most trusted luxury retail brand." },
          { title: "Values", text: "Integrity, customer satisfaction, and timeless elegance." },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 bg-white/10 rounded-2xl border border-yellow-500/20 shadow-[0_0_10px_#FFD70020] hover:shadow-[0_0_20px_#FFD70040] transition-all duration-300"
          >
            <h3 className="text-yellow-300 font-bold mb-2 text-xl">{card.title}</h3>
            <p className="text-gray-400">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


