"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { runFlow, streamFlow } from '@genkit-ai/next/client';
import { menuSuggestionFlow } from '@/lib/genkit';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {auth} from "@/lib/firebase"
const words = ['Send', 'Collect', 'Do Something'];

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

  async function getMenuItem(formData: FormData) {
    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);

    try {
      // Regular (non-streaming) approach
      console.log("theme:", theme)
      const result = await runFlow<typeof menuSuggestionFlow>({
        url: '/api/menuSuggestion',
        input: { theme },
      });

      setMenuItem(result.menuItem);
    } catch (error) {
      console.error('Error generating menu item:', error);
    } finally {
      setIsLoading(false);
    }
  }
  async function streamMenuItem(formData: FormData) {
    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);
    setStreamedText('');

    try {
      // Streaming approach
      const result = streamFlow<typeof menuSuggestionFlow>({
        url: '/api/menuSuggestion',
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
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
          />
        </div> 

        <form action={getMenuItem}>
          <label htmlFor="theme">Suggest a menu item for a restaurant with this theme: </label>
          <input type="text" name="theme" id="theme" />
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

        {streamedText && (
          <div>
            <h3>Streaming Output:</h3>
            <pre>{streamedText}</pre>
          </div>
        )}

        {menuItem && (
          <div>
            <h3>Final Output:</h3>
            <pre>{menuItem}</pre>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
