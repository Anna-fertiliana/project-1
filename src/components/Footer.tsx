export default function Footer() {
  return (
    <footer className="mt-24 border-t pt-16 pb-10 text-center">
      
      {/* Logo */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <img
          src="/logo.svg"
          alt="Booky Logo"
          className="w-8 h-8"
        />
        <h3 className="text-xl font-semibold">Booky</h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm max-w-xl mx-auto mb-8">
        Discover inspiring stories & timeless knowledge, ready to borrow anytime.
        Explore online or visit our nearest library branch.
      </p>

      {/* Social Media */}
      <div className="mb-4 text-sm font-medium">
        Follow on Social Media
      </div>

      <div className="flex justify-center gap-4">
        {[
          { name: "Facebook", icon: "/fb.svg" },
          { name: "Instagram", icon: "/ig.svg" },
          { name: "LinkedIn", icon: "/link.svg" },
          { name: "TikTok", icon: "/tiktok.svg" },
        ].map((social) => (
          <a
            key={social.name}
            href="#"
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img
              src={social.icon}
              alt={social.name}
              className="w-5 h-5"
            />
          </a>
        ))}
      </div>

    </footer>
  );
}