"use client"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { runFlow, streamFlow } from '@genkit-ai/next/client';
import { jobFlow, menuSuggestionFlow } from '@/lib/genkit';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { initializeApp } from 'firebase/app';
import {auth} from "@/lib/firebase"
import { set } from "zod"

import {BusinessCard, BusinessType } from "@/components/businessCard"
import { WorkerCard } from "@/components/WorkerCard"

// import { Player } from 'lottie-react';
import Lottie from "lottie-react";

import animationData from '../public/TeacherSearch-GoLearn.json';
import Spinner from '@/components/Spinner';
const words = ['Send', 'Collect', 'Do Something'];

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
  const [inputValue, setInputValue] = useState<string>(""); // initialize with empty string
  const [history, setHistory] = useState<string[]>([]); // initialize with empty array of strings
  const [completeStep1, setCompleteStep1] = useState<boolean>(false); 

  interface JobResult {

    local_business?: any[];
    // add other properties if needed
  }
  const [jobResult, setJobResult] = useState<JobResult>({});
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState<string>('');

  interface InputChangeEvent {
    target: { value: string };
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> & InputChangeEvent): void => {
    setInputValue(e.target.value); // update state with input value
  }
  async function handleFormSubmit(formData: FormData) {
    const user = auth.currentUser
    const idToken = await user?.getIdToken();
    console.log("idToken:", idToken)
  
    // const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);

    if (inputValue.trim() !== '') {
      setHistory(prevHistory => [...prevHistory, inputValue]); // push to history
    }
      console.log("theme:", inputValue)


    try {
      // Regular (non-streaming) approach
      console.log("theme:", inputValue)
      const result = await runFlow<typeof jobFlow>({
        url: '/api/job',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        input: { theme: inputValue },
      });

      setJobResult(result.jobResult);
      console.log(result.jobResult)
      // Push to Firestore
      const docRef = await addDoc(collection(db, 'job'), {
        ...result.jobResult, // save all properties of result
        createdAt: new Date(),
      });

      
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

  
  // Step 2: Step process 
  const steps = [
  "Summarize request using GenAI to analyse the request..",
  "Matching...",
  "Finalizing...",
]

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completed, setCompleted] = useState<boolean>(false)
  const [loading, setLoading] = useState(false); // optional: show loading state

  useEffect(() => {
    if (isLoading){
      const runInstallationSteps = async () => {
        for (let i = 0; i < steps.length; i++) {
          
          if (i = 0) {
            while(!completeStep1) {
        
            }
          }else {
            await simulateStep(i)
          }
          setCurrentStep(i + 1)
        }
        setCompleted(true)
      }

      runInstallationSteps()
    }

  }, [isLoading])

  const simulateStep = (step: number) => {
    // Simulate async work: replace this with real API logic
    return new Promise((resolve) => {
      setTimeout(resolve, 2000) // 2 seconds per step
    })
  }

  const handlePaste = (input: string) => {
    console.log(input)
    setInputValue(input)
  }

  return (
  
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
        {/* Hero */}
      <section id="rates" className="bg-gradient-to-b from-[hsl(211_100%_98%)] to-white">
 
      </section>
      <main className="container flex flex-col gap-[32px] row-start-2 items-center sm:items-star justify-center">
       <div className="container mx-auto px-8 py-12 md:py-18">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[hsl(var(--primary))]">
                Run for you 24/7
              </h1>
              <p className="mt-4 max-w-xl text-neutral-700 text-base md:text-lg">
                Non stop
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-2xl font-semibold">
                  <span  className="w-[7rem]">I want to</span>
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
                  placeholder="I want someone to fix my broken pipe in cyberjaya my budget is rm 50 , i need this to he done asap"
                  className="w-full px-4 py-3 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  value={inputValue}
                  onChange={(e)=> handleChange(e)}
                />
              </div> 

              <Button variant="default" className={`rounded-full 
              shadow-lg hover:brightness-110 text-sm md:text-base px-6 py-3 my-2 
                ${isLoading ? 'cursor-not-allowed brightness-90' : ''}`
                } 
              >
                 {isLoading ? (
                  <>
                    <Spinner />
                    <span className="ml-3">Loading...</span>
                  </>
                ) : (
                  'Find Now'
                )}
              </Button>
              {/* <Button className="inline-flex items-center rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm md:text-base font-bold shadow-lg hover:brightness-110">Book Now</Button> */}
            </form>

              {/* <p className="mt-3 text-xs text-neutral-500">More note</p> */}
            </div>
            <div className="relative">
              {/* <div className="mx-auto aspect-[4/3] w-full max-w-md rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] shadow-[0_40px_120px_-40px_hsl(211_100%_30%_/_0.4)]" > */}
              <Lottie animationData={animationData} loop={true} className="mx-auto aspect-[4/3] w-full max-w-md rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] shadow-[0_40px_120px_-40px_hsl(211_100%_30%_/_0.4)]"/>
              {/* <Player
                autoplay
                loop
                src={animationData}
                style={{ height: '100%', width: '100%' }}
              /> */}
              {/* <Player autoplay loop src="https://assets7.lottiefiles.com/packages/lf20_x62chJ.json" /> */}
              {/* </div> */}
            </div>
          </div>
        </div>


        {/* Step 2 */}
        <div className="max-w-md mx-auto mt-10 space-y-4">
          {isLoading && steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {index < currentStep ? (
                <CheckCircle className="text-green-500 h-4 w-4" />
              ) : index === currentStep ? (
                <Loader2 className="animate-spin text-blue-500 h-4 w-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span
                className={cn(
                  index < currentStep && "text-green-700",
                  index === currentStep && "text-blue-700"
                )}
              >
                {step}
              </span>
            </div>
          ))}

          {completed && (
            <div className="flex items-center space-x-2 text-green-700 font-medium">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Complete.</span>
            </div>
          )}
        </div>

        {/* Find pet groomer in kl for RM50/hr. I am near bukit jalil */}
        <div className="container mx-auto px-8 py-12 md:py-18">
          {jobResult && Object.keys(jobResult).length > 0 ? (
            <>
              <h1 className="text-4xl font-bold text-center my-8">
                On-Demand Workers
              </h1>
              <WorkerCard jobResult={jobResult as any} />
            </>
          ) : (
            <p className="text-gray-600 text-center">No results yet.</p>
          )}
        </div>
        <div className="container mx-auto px-8 py-12 md:py-18">
          {jobResult && Array.isArray(jobResult?.local_business ) && jobResult?.local_business.length> 0 && 
            <BusinessCard businesses={Array.isArray(jobResult?.local_business ) ? jobResult.local_business : []} />
          }
         
          {/* {
            jobResult && jobResult?.local_business && (jobResult?.local_business.map((biz, index) => (
              
            ))
          } */}

        </div>
  


    
          <div>
          { history && history.length > 0 && (<h2> <strong>History</strong></h2>)}
          
          {
            history && history.map((i,index) => (
              <p key={index}>{i} <Button size={"sm"} variant="outline" onClick={() => handlePaste(i)}>Again</Button></p>
            ))
          }
        </div>
        {/* Step 1: GenAI to generate response in 
        [
          {item: "Pet my dog", type: "help", fee:"45" feeType: "per day", currency: "MYR", depart: "", end: "", due: ""},
          {item: "Bug dog food of brand wisky with budget 25", type:"grocery", fee:"25" feeType: "per day", currency: "MYR"},
          {item: "Pet my dog", type: "send", fee:"45" feeType: "per day", currency: "MYR"},
          {item: "Pet my dog", type: "collect", fee:"45" feeType: "per day", currency: "MYR"},
        ] 
          Step 2: Match runner
         fasttrooper.com, dashlydo.com, sortdone.com
          SQL to get provider

          Step 3: Payment

          Step 4: Work done 

          Step 5: Service delivered
         
         */}
         


        {/* <form action={handleFormSubmit}>
          <label htmlFor="theme">Suggest a menu item for a restaurant with this theme: </label>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
          />
          <br />
          <br />
          <button type="submit" disabled={isLoading}>
            Generate
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget.form!);
              streamMenuItem(formData);
            }}
          >
            Stream Generation
          </button>
        </form>
        <br />
        */}
        {streamedText && (
          <div className="flex items-center">
            <h3>Streaming Output:</h3>
            <p>{streamedText}</p>
          </div>
        )}

        {jobResult && (

          <div className="bg-gray-900 text-white p-4 rounded-md shadow-md w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{"GenAI Output"}</h2>
              {/* <button
                onClick={handleCopy}
                className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button> */}
            </div>
            <pre className="overflow-auto max-h-[500px] text-sm bg-gray-800 p-3 rounded">
              <code>{JSON.stringify(jobResult, null, 2)}</code>
            </pre>
          </div>
          // <div className="flex items-center">
          //   <h3>LLM Output:</h3>
          //   <p>{JSON.stringify(jobResult)}</p>
          // </div>
        )} 

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
