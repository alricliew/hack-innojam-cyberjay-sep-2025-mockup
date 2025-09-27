// components/BusinessCard.jsx

import React from "react";

export type BusinessType = {
  name: string;
  url: string;
  image?: string; // Optional image property
  reviews: string[];
};

export interface BusinessCardProps {
  businesses: BusinessType[]; // Ensure businesses is an array of BusinessType
}

const businessImage = [
  "/business/IMG_5498.jpg",
  "/business/IMG_5499.jpg",
  "/business/IMG_5500.jpg",
  "/business/IMG_5501.jpg",
  "/business/IMG_5503.jpg",
]

export function BusinessCard({ businesses }: BusinessCardProps) {
  // Check if businesses is a valid array
  if (!Array.isArray(businesses) || businesses.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No businesses available.
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Businesses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Render the image only if a valid URL is provided */}
                <img
                  src={biz.image || businessImage[idx]}
                  alt={biz.name}
                  className="w-full h-48 object-cover"
                />
              {/* {biz.image ? (
                <img
                  src={biz.image || businessImage[idx]}
                  alt={biz.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )} */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">
                  {biz.name}
                </h3>
                <a
                  href={biz.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline mb-2 inline-block"
                >
                  Visit Website
                </a>
                {/* Uncomment this section if you want to display reviews */}
                {/* <ul className="mt-2 space-y-1 text-gray-600 text-sm">
                  {biz.reviews.map((review: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      {review}
                    </li>
                  ))}
                </ul> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}