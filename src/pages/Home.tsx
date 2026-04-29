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
      <section className="px-4 py-5 md:px-6 md:py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#BFD9F2] md:rounded-3xl">
          <img
            src="/hero.svg"
            alt="Hero"
            className="h-40 w-full object-cover md:h-56 lg:h-auto"
          />
        </div>

        {/* DOTS */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mt-6 px-4 md:mt-10 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((item) => (
            <div
              key={item.name}
              className="cursor-pointer rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md md:rounded-2xl md:p-4"
            >
              <div className="mb-2 flex h-14 items-center justify-center rounded-lg bg-[#DCE8F6] md:mb-3 md:h-16 md:rounded-xl">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-6 w-6 md:h-8 md:w-8"
                />
              </div>

              <p className="text-center text-xs font-medium text-gray-700 md:text-sm">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto mt-8 max-w-7xl px-4 md:mt-10 md:px-6 lg:px-8">
        <Recommendation />
        <PopularAuthors />
      </main>
    </div>
  );
}