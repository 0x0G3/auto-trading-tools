import Link from "next/link";
// import Image from "next/image";
import React, { useState, useRef } from "react";

export default function Navbar() {
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs to manage timeouts for dropdowns
  const featuresTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Feature links for the Features dropdown
  const featureLinks = [
    { name: "Toolkits", href: "/toolkits" },
    { name: "Screeners", href: "/screeners" },
    { name: "Backtesting", href: "/backtesting" },
    { name: "AIBacktesting", href: "/aibacktesting" },
  ];

  // Resources links for the Resources dropdown
  const resourcesLinks = [
    { name: "Support", href: "/support" },
    { name: "Guides", href: "/guides" },
    { name: "Data Resources", href: "/dataresources" },
    { name: "Funding", href: "/funding" },
  ];

  // Handle mouse enter for Features dropdown
  const handleFeaturesMouseEnter = () => {
    if (featuresTimeoutRef.current) {
      clearTimeout(featuresTimeoutRef.current);
    }
    setIsFeaturesDropdownOpen(true);
  };

  // Handle mouse leave for Features dropdown
  const handleFeaturesMouseLeave = () => {
    featuresTimeoutRef.current = setTimeout(() => {
      setIsFeaturesDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  // Handle mouse enter for Resources dropdown
  const handleResourcesMouseEnter = () => {
    if (resourcesTimeoutRef.current) {
      clearTimeout(resourcesTimeoutRef.current);
    }
    setIsResourcesDropdownOpen(true);
  };

  // Handle mouse leave for Resources dropdown
  const handleResourcesMouseLeave = () => {
    resourcesTimeoutRef.current = setTimeout(() => {
      setIsResourcesDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  return (
    <nav className="bg-gray-800 text-white w-full sticky top-0 z-50">
      <div className="flex items-center justify-between mx-4 sm:mx-6 md:mx-8 lg:mx-12 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* <Image
            // src="/logo.svg" // Replace with your logo path
            className="h-8 w-auto"
            alt="YourBrand Logo"
            width={32}
            height={32}
          /> */}
          <span className="ml-3 text-2xl font-semibold">YourBrand</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white hover:bg-gray-700 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Navigation Links and CTAs (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <div
            className="relative"
            onMouseEnter={handleFeaturesMouseEnter}
            onMouseLeave={handleFeaturesMouseLeave}
          >
            <Link
              href="/features"
              className="flex items-center text-base font-bold text-white hover:text-blue-500 transition-colors duration-200 px-4"
            >
              Features
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {isFeaturesDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 animate-dropdown-open"
                onMouseEnter={handleFeaturesMouseEnter}
                onMouseLeave={handleFeaturesMouseLeave}
              >
                {featureLinks.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="block px-4 py-2 text-base text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                  >
                    {feature.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={handleResourcesMouseEnter}
            onMouseLeave={handleResourcesMouseLeave}
          >
            <Link
              href="/resources"
              className="flex items-center text-base font-bold text-white hover:text-blue-500 transition-colors duration-200 px-4"
            >
              Resources
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {isResourcesDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 animate-dropdown-open"
                onMouseEnter={handleResourcesMouseEnter}
                onMouseLeave={handleResourcesMouseLeave}
              >
                {resourcesLinks.map((resource) => (
                  <Link
                    key={resource.href}
                    href={resource.href}
                    className="block px-4 py-2 text-base text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                  >
                    {resource.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/pricing"
            className="text-base text-white hover:text-blue-500 transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-base text-white hover:text-blue-500 transition-colors duration-200"
          >
            Contact
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 text-base text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-white text-base text-white rounded-full hover:bg-white hover:text-gray-800 transition-colors duration-200"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 animate-mobile-menu-open">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="/features"
                className="flex items-center py-2 text-base font-bold text-white hover:text-blue-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              <ul className="pl-4 flex flex-col space-y-2">
                {featureLinks.map((feature) => (
                  <li key={feature.href}>
                    <Link
                      href={feature.href}
                      className="block py-2 text-base text-gray-200 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {feature.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                href="/resources"
                className="flex items-center py-2 text-base font-bold text-white hover:text-blue-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resources
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              <ul className="pl-4 flex flex-col space-y-2">
                {resourcesLinks.map((resource) => (
                  <li key={resource.href}>
                    <Link
                      href={resource.href}
                      className="block py-2 text-base text-gray-200 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {resource.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                href="/pricing"
                className="block py-2 text-base text-white hover:text-blue-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-2 text-base text-white hover:text-blue-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="block py-2 px-4 bg-blue-600 text-base text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="block py-2 px-4 border border-white text-base text-white rounded-full hover:bg-white hover:text-gray-800 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
