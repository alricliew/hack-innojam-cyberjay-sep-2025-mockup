// components/BusinessCard.jsx

import React from 'react';

const businesses = [
  {
    name: "Coffee Corner",
    url: "https://coffeecorner.com",
    image: "https://source.unsplash.com/400x300/?coffee",
    reviews: [
      "Great atmosphere and friendly staff.",
      "Best cappuccino in town!",
    ],
  },
  {
    name: "TechFix Repairs",
    url: "https://techfix.com",
    image: "https://source.unsplash.com/400x300/?laptop,repair",
    reviews: [
      "Fixed my phone in under 30 minutes.",
      "Affordable and reliable service.",
    ],
  },
  {
    name: "Green Garden Café",
    url: "https://greengarden.com",
    image: "https://source.unsplash.com/400x300/?cafe,plants",
    reviews: [
      "Loved the vegan options.",
      "Cozy place with a green vibe.",
    ],
  },
];

export type BusinessType = {
  name: string;
  url: string;
  image: string;
  reviews: string[];
};
export interface BusinessCardProps {
  businesses: any[];
}

export function BusinessCard({ businesses }: BusinessCardProps)  {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Nearby Businesses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src={biz?.image ?? ""}
                alt={biz.name}
                className="w-full h-48 object-cover"
              />
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