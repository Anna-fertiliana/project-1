import Recommendation from "../components/Recommendation";
import PopularAuthors from "../components/PopularAuthor";
import Footer from "../components/Footer";

export default function Home() {
  const categories = [
    { name: "Fiction", icon: "/icons/fiction.svg" },
    { name: "Non-Fiction", icon: "/icons/non-fiction.svg" },
    { name: "Self-Improvement", icon: "/icons/self.svg" },
    { name: "Finance", icon: "/icons/finance.svg" },
    { name: "Science", icon: "/icons/science.svg" },
    { name: "Education", icon: "/icons/education.svg" },
  ];

  return (
    <div>

      {/* HERO */}
      <section className="px-8 py-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#BFD9F2]">
          <img
            src="/hero.svg"
            alt="Hero"
            className="w-full object-cover"
          />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-8 mt-10">
        <div className="grid grid-cols-6 gap-6">
          {categories.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="bg-[#DCE8F6] rounded-xl h-16 flex items-center justify-center mb-3">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-8 h-8"
                />
              </div>

              <p className="text-sm font-medium text-gray-700 text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-8">
        <Recommendation />
        <PopularAuthors />
      </div>

      <Footer />
    </div>
  );
}