"use client"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { runFlow, streamFlow } from '@genkit-ai/next/client';
import { jobFlow, menuSuggestionFlow } from '@/lib/genkit';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';


import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


import {auth} from "@/lib/firebase"
const words = ['Pet groomer', 'Painting', 'Send Surprice', "Babysitter", "Fix broken pipe", "Punctured tire", "Throw rubbish", "Send parcel"];

const steps = [
  "Processing your request...",
  "Assigning resource to your account...",
  "Finalizing...",
]
export default function Home() {

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("User: ", uid)
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const [menuItem, setMenuItem] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState<string>('');

  async function handleFormSubmit(formData: FormData) {
    const user = auth.currentUser
    const idToken = await user?.getIdToken();
    console.log("idToken:", idToken)


    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);

    try {
      // Regular (non-streaming) approach
      console.log("theme:", theme)
      const result = await runFlow<typeof jobFlow>({
        url: '/api/jobFlow',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        input: { theme },
      });

      setMenuItem(result.jobResult);
    } catch (error) {
      console.error('Error generating menu item:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);


  // User
   const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobsCollection = collection(db, 'job');

    // Listen for real-time updates
    const unsubscribe = onSnapshot(jobsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs: ", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  
  return (
  
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 sm:p-20">
      
      <main className="container flex flex-col gap-[32px] row-start-2 items-center sm:items-star justify-center">
        <div className="container mx-auto px-8 py-12 md:py-18">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[hsl(var(--primary))]">
                Run & Earn 24/7
              </h1>
              <p className="mt-4 max-w-xl text-neutral-700 text-base md:text-lg">
                Monetize your skills!
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-2xl font-semibold">
                  <span className="w-[7rem]">I want to</span>
                  <div className="h-[2.5rem] overflow-hidden relative w-[15rem]">
                    <div
                      className="absolute transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateY(-${index * 2.5}rem)` }}
                    >
                      {words.map((word, idx) => (
                        <div key={idx} className="h-[2.5rem] flex items-center">
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            <form className="relative w-full max-w-md" action={handleFormSubmit}>
              <div className="relative w-full max-w-md">
                <Textarea 
                  // type="text"
                  rows={3}
                  placeholder="Type something..."
                  className="pl-10"
                />
              </div> 

              <Button variant="default" className="rounded-full shadow-lg hover:brightness-110 text-sm md:text-base px-6 py-3 my-2" >
                Search Now
              </Button>
              {/* <Button className="inline-flex items-center rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm md:text-base font-bold shadow-lg hover:brightness-110">Book Now</Button> */}
            </form>

              {/* <p className="mt-3 text-xs text-neutral-500">More note</p> */}
            </div>
            {/* <div className="relative">
              <Lottie animationData={animationData} loop={true} className="mx-auto aspect-[4/3] w-full max-w-md rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] shadow-[0_40px_120px_-40px_hsl(211_100%_30%_/_0.4)]"/>
            </div> */}
          </div>
        </div>
        {/* <div className="flex items-center space-x-2 text-2xl font-semibold">
          <span>Hi Runner! </span>
          <div className="h-[2.5rem] overflow-hidden relative w-[15rem]">
            <div
              className="absolute transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${index * 2.5}rem)` }}
            >
              {words.map((word, idx) => (
                <div key={idx} className="h-[2.5rem] flex items-center">
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* <form className="relative w-full max-w-md" action={handleFormSubmit}>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Type something..."
              className="pl-10"
            />
          </div> 
          <Button variant="outline">Book Now</Button>
        </form> */}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map(job => (
          <li key={job.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">{job.task || "Untitled Job"}</h3>

            <div className="space-y-2 text-gray-700 text-sm">
              {job.price !== undefined && (
                <div>
                  <strong>Price:</strong> RM {job.price || "TBD"}
                </div>
              )}
              {job.recommendedPrice !== undefined && (
                <div>
                  <strong>Recommended Price:</strong> RM {job.recommendedPrice}
                </div>
              )}
              {job.location && (
                <div>
                  <strong>Location:</strong> {job.location}
                </div>
              )}
              {job.urgency && (
                <div>
                  <strong>Urgency:</strong> <span className={`font-semibold ${
                    job.urgency.toLowerCase() === 'high' ? 'text-red-600' :
                    job.urgency.toLowerCase() === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{job.urgency}</span>
                </div>
              )}
            </div>
            <Button>Apply Now</Button>
          </li>
        ))}
      </ul>        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
