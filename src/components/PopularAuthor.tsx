export default function PopularAuthors() {
  const authors = [
    { id: 1, name: "Author name", books: 5 },
    { id: 2, name: "Author name", books: 5 },
    { id: 3, name: "Author name", books: 5 },
    { id: 4, name: "Author name", books: 5 },
  ];

  return (
    <section className="mt-20 border-t pt-12">
      <h2 className="text-2xl font-semibold mb-8">
        Popular Authors
      </h2>

      <div className="grid grid-cols-4 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex items-center gap-4"
          >
            {/* Avatar dari public */}
            <img
              src="/profile.svg"
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover bg-gray-100 p-2"
            />

            {/* Info */}
            <div>
              <h3 className="font-medium text-sm">
                {author.name}
              </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img
                src="/book-icon.svg"
                alt="book icon"
                className="w-4 h-4"
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