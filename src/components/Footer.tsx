export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white px-4 pt-10 pb-8 text-center sm:mt-20 sm:pt-14 sm:pb-10 lg:mt-24 lg:pt-16">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center gap-2 sm:gap-3">
        <img
          src="/logo.svg"
          alt="Booky Logo"
          className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
        />
        <h3 className="text-lg font-semibold sm:text-xl">
          Booky
        </h3>
      </div>

      {/* Description */}
      <p className="mx-auto mb-6 max-w-xs text-xs leading-relaxed text-gray-600 sm:mb-8 sm:max-w-xl sm:text-sm">
        Discover inspiring stories & timeless knowledge, ready to borrow anytime.
        Explore online or visit our nearest library branch.
      </p>

      {/* Social title */}
      <p className="mb-4 text-xs font-medium sm:text-sm">
        Follow on Social Media
      </p>

      {/* Social icons */}
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
            aria-label={social.name}
            className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-gray-100 sm:h-10 sm:w-10"
          >
            <img
              src={social.icon}
              alt={social.name}
              className="h-4 w-4 sm:h-5 sm:w-5"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}