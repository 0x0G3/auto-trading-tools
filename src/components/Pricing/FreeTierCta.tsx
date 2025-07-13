import React from "react";

export default function FreeTierCta() {
  return (
    <section className="bg-base-200 py-1">
      <div className="container mx-auto ">
        <div className="flex flex-col lg:flex-row-reverse items-center p-4 gap-8">
          {/* Visual Section - Ready for Component Replacement */}
          <div className="flex-1 max-w-sm">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              alt="Free Tier Visual"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-8xl md:text-5xl font-bold mb-6">
              Experience Our Free Tools First
            </h1>
            <p className="mb-6 text-xl">
              Upgrade to exclusive features whenever you're ready to take your
              trading to the next level.
            </p>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </section>
  );
}
