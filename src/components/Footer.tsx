export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 lg:mt-24 border-t pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10 text-center bg-white">
      
      {/* Logo */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <img
          src="/logo.svg"
          alt="Booky Logo"
          className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
        />
        <h3 className="text-lg sm:text-xl font-semibold">
          Booky
        </h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs sm:text-sm max-w-sm sm:max-w-xl mx-auto mb-6 sm:mb-8 px-4">
        Discover inspiring stories & timeless knowledge, ready to borrow anytime.
        Explore online or visit our nearest library branch.
      </p>

      {/* Social Media */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium">
        Follow on Social Media
      </div>

      <div className="flex justify-center gap-3 sm:gap-4">
        {[
          { name: "Facebook", icon: "/fb.svg" },
          { name: "Instagram", icon: "/ig.svg" },
          { name: "LinkedIn", icon: "/link.svg" },
          { name: "TikTok", icon: "/tiktok.svg" },
        ].map((social) => (
          <a
            key={social.name}
            href="#"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img
              src={social.icon}
              alt={social.name}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </a>
        ))}
      </div>

    </footer>
  );
}