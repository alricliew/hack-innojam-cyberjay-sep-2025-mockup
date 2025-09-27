"use client"
import React, { useState, useEffect } from "react";

export type WorkerType = {
  name: string;
  skills: string[];
  location: string;
  image?: string;
};

const workers: WorkerType[] = [
  { image: "/user/629.jpg", name: "Arif H.", skills: ["logistic", "helper"], location: "kl", },
  { image: "/user/IMG_5471.jpg", name: "Siti A.", skills: ["grocery", "helper"], location: "shah_alam" },
  { image: "/user/close-up-portrait-businesswoman-asian-female-entrepreneur-suit-smiling-looking-professional-standing-against-white-background.jpg", name: "Kumar R.", skills: ["logistic", "grocery"], location: "petaling_jaya" },
  { image: "/user/IMG_5491.jpg", name: "Nurul F.", skills: ["helper", "grocery"], location: "cyberjaya" },
  { image: "/user/IMG_5477.jpg", name: "Daniel L.", skills: ["logistic", "helper"], location: "kl" },
  { image: "/user/IMG_5478.jpg", name: "Hafiz R.", skills: ["grocery", "helper"], location: "shah_alam" },
  { image: "/user/IMG_5480.jpg", name: "Mei Y.", skills: ["logistic", "grocery"], location: "kl" },
  { image: "/user/IMG_5479.jpg", name: "Rahman Z.", skills: ["helper", "logistic"], location: "petaling_jaya" },
  { image: "/user/IMG_5478.jpg", name: "Sophia K.", skills: ["grocery", "helper"], location: "subang_jaya" },
  { image: "/user/IMG_5474.jpg", name: "Vinod S.", skills: ["logistic", "helper"], location: "kl" },
  { image: "/user/IMG_5479.jpg", name: "Hana R.", skills: ["helper", "grocery"], location: "shah_alam" },
  { image: "/user/IMG_5475.jpg", name: "Ali M.", skills: ["logistic", "helper"], location: "ampang" },
  { image: "/user/IMG_5487.jpg", name: "Wei T.", skills: ["grocery", "logistic"], location: "kl" },
  { image: "/user/629.jpg", name: "Azlan Y.", skills: ["helper", "grocery"], location: "petaling_jaya" },
  { image: "/user/IMG_5490.jpg", name: "Farah I.", skills: ["grocery", "helper"], location: "kl" },
  { image: "/user/IMG_5484.jpg", name: "Ravi N.", skills: ["logistic", "helper"], location: "cyberjaya" },
  { image: "/user/IMG_5491.jpg", name: "Maria L.", skills: ["helper", "grocery"], location: "kl" },
  { image: "/user/IMG_5487.jpg", name: "Imran F.", skills: ["logistic", "helper"], location: "shah_alam" },
  { image: "/user/IMG_5485.jpg", name: "Tan H.", skills: ["helper", "grocery"], location: "kl" },
  { image: "/user/IMG_5488.jpg", name: "Nadia B.", skills: ["grocery", "helper"], location: "petaling_jaya" },
];

type WorkerCardProps = {
  jobResult: {
    skill: string;
    location: string;
    recommended_price: string;
  };
};

export function WorkerCard({ jobResult }: WorkerCardProps) {
  const [selectedWorker, setSelectedWorker] = useState<WorkerType | null>(null);
  const [userPrice, setUserPrice] = useState<string>(""); // State for user-entered price
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State for submission
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading workers

  // Simulate loading workers
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Filter workers based on the jobResult's skill and location
  const filteredWorkers = workers.filter(
    (worker) =>
      worker.skills.includes(jobResult.skill) &&
      worker.location === jobResult.location
  );

  const handleUseRecommendedPrice = () => {
    setUserPrice(jobResult.recommended_price); // Set the user price to the recommended price
  };

  const handleSubmitOffer = async () => {
    if (!userPrice || isNaN(Number(userPrice))) {
      alert("Please enter a valid price before submitting the offer.");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending the offer (replace this with an API call if needed)
    console.log("Sending offer to worker:", {
      worker: selectedWorker,
      price: userPrice,
    });

    // Simulate a delay for the submission
    setTimeout(() => {
      alert(`Offer sent to ${selectedWorker?.name} for MYR ${userPrice}`);
      setIsSubmitting(false);
      setSelectedWorker(null); // Close the modal after submission
    }, 1500);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Available Workers
        </h2>

        {isLoading ? (
          // Loading animation
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker, idx) => (
                <button
                  key={idx}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 text-left"
                  onClick={() => {
                    setSelectedWorker(worker);
                    setUserPrice(""); // Reset user price when opening the modal
                  }}
                >
                  <img
                    src={
                      worker?.image ??
                      `https://source.unsplash.com/400x300/?person,worker,${worker.skills[0]}`
                    }
                    alt={worker.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {worker.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Skills:</strong> {worker.skills.join(", ")}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Location:</strong> {worker.location}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                No workers match the required skills and location.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal for Worker Details */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{selectedWorker.name}</h3>
            <img
              src={
                selectedWorker?.image ??
                `https://source.unsplash.com/400x300/?person,worker,${selectedWorker.skills[0]}`
              }
              alt={selectedWorker.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-600 text-sm mb-2">
              <strong>Skills:</strong> {selectedWorker.skills.join(", ")}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Location:</strong> {selectedWorker.location}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Recommended Price:</strong> MYR {jobResult.recommended_price}
            </p>

            {/* User Price Input */}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter Your Price:
              </label>
              <input
                type="number"
                value={userPrice}
                onChange={(e) => setUserPrice(e.target.value)}
                placeholder="Enter your price"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="mt-2 text-blue-500 underline"
                onClick={handleUseRecommendedPrice}
              >
                Use Recommended Price
              </button>
            </div>

            {/* Submit Offer Button */}
            <div className="flex justify-end mt-4">
              <button
                className={`px-4 py-2 rounded-md text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={handleSubmitOffer}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Offer"}
              </button>
              <button
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setSelectedWorker(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}