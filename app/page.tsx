"use client"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { runFlow, streamFlow } from '@genkit-ai/next/client';
import { jobFlow, menuSuggestionFlow } from '@/lib/genkit';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import {auth} from "@/lib/firebase"
const words = ['Send', 'Collect', 'Do Something'];

const steps = [
  "Summarize request using GenAI to analyse the request..",
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
  const [inputValue, setInputValue] = useState<string>(""); // initialize with empty string
  const [history, setHistory] = useState<string[]>([]); // initialize with empty array of strings
  const [completeStep1, setCompleteStep1] = useState<boolean>(false); 

  const [menuItem, setMenuItem] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState<string>('');

  interface InputChangeEvent {
    target: { value: string };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> & InputChangeEvent): void => {
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
      setInputValue(''); // clear input
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

      setMenuItem(result.jobResult);
    } catch (error) {
      console.error('Error generating menu item:', error);
    } finally {
      setIsLoading(false);
    }
  }
  async function streamMenuItem(formData: FormData) {
    const user = auth.currentUser
    const idToken = await user?.getIdToken();
    console.log("idToken:", idToken)
    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);
    setStreamedText('');

    try {
      // Streaming approach
      const result = streamFlow<typeof menuSuggestionFlow>({
        url: '/api/menuSuggestion',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        input: { theme },
      });

      // Process the stream chunks as they arrive
      for await (const chunk of result.stream) {
        setStreamedText((prev) => prev + chunk);
      }

      // Get the final complete response
      const finalOutput = await result.output;
      setMenuItem(finalOutput.menuItem);
    } catch (error) {
      console.error('Error streaming menu item:', error);
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
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completed, setCompleted] = useState<boolean>(false)
  const [loading, setLoading] = useState(false); // optional: show loading state

  useEffect(() => {
    const runInstallationSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        
        if (i = 0) {
          // while(!completeStep1) {
          //   await
          // }
        }else {
          await simulateStep(i)
        }
        setCurrentStep(i + 1)
      }
      setCompleted(true)
    }

    runInstallationSteps()
  }, [])

  const simulateStep = (step: number) => {
    // Simulate async work: replace this with real API logic
    return new Promise((resolve) => {
      setTimeout(resolve, 2000) // 2 seconds per step
    })
  }

  return (
  
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      
      <main className="container flex flex-col gap-[32px] row-start-2 items-center sm:items-star justify-center">
       
        <div className="flex items-center space-x-2 text-2xl font-semibold">
          <span>I want to</span>
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
        <form className="relative w-full max-w-md" action={handleFormSubmit}>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Type something..."
              className="pl-10"

              onChange={(e)=> handleChange(e)}
            />
          </div> 
          <Button variant="outline">Book Now</Button>
        </form>

        {
          inputValue
        }

        <div>
          <h2>History</h2>
          {
            history && history.map(i => (
              <>i</>
            ))
          }
        </div>
        {/* Step 2 */}
        <div className="max-w-md mx-auto mt-10 space-y-4">
          {steps.map((step, index) => (
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

        {menuItem && (
          <div className="flex items-center">
            <h3>Final Output:</h3>
            <p>{menuItem}</p>
          </div>
        )} 

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
