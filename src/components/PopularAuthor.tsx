export default function PopularAuthors() {
  const authors = [
    { id: 1, name: "Author name", books: 5 },
    { id: 2, name: "Author name", books: 5 },
    { id: 3, name: "Author name", books: 5 },
    { id: 4, name: "Author name", books: 5 },
  ];

  return (
    <section className="mt-10 border-t pt-8 sm:mt-14 sm:pt-10 lg:mt-16 lg:pt-12">
      <h2 className="mb-5 text-lg font-semibold sm:mb-6 sm:text-xl lg:text-2xl">
        Popular Authors
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:gap-4 sm:p-5"
          >
            {/* Avatar */}
            <img
              src="/profile.svg"
              alt={author.name}
              className="h-12 w-12 rounded-full bg-gray-100 p-2 object-cover sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            />

            {/* Info */}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium sm:text-base">
                {author.name}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                <img
                  src="/book-icon.svg"
                  alt="book icon"
                  className="h-3 w-3 sm:h-4 sm:w-4"
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