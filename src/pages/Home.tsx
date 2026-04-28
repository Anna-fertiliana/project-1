import Recommendation from "../components/Recommendation";
import PopularAuthors from "../components/PopularAuthor";

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
    <div className="bg-gray-50">

      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#BFD9F2]">
          <img
            src="/hero.svg"
            alt="Hero"
            className="w-full h-40 sm:h-56 lg:h-auto object-cover"
          />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="bg-[#DCE8F6] rounded-lg sm:rounded-xl h-14 sm:h-16 flex items-center justify-center mb-2 sm:mb-3">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>

              <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Recommendation />
        <PopularAuthors />
      </div>
    </div>
  );
}