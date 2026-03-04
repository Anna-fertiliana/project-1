export default function PopularAuthors() {
  const authors = [
    { id: 1, name: "Author name", books: 5 },
    { id: 2, name: "Author name", books: 5 },
    { id: 3, name: "Author name", books: 5 },
    { id: 4, name: "Author name", books: 5 },
  ];

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20 border-t pt-8 sm:pt-10 lg:pt-12">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
        Popular Authors
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
          >
            {/* Avatar */}
            <img
              src="/profile.svg"
              alt={author.name}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover bg-gray-100 p-2"
            />

            {/* Info */}
            <div>
              <h3 className="font-medium text-sm sm:text-base">
                {author.name}
              </h3>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                <img
                  src="/book-icon.svg"
                  alt="book icon"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span>{author.books} books</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}