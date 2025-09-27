import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// export const jobFlow = ai.defineFlow(
//   {
//     name: 'jobFlow',
//     inputSchema: z.object({ theme: z.string() }),
//     outputSchema: z.object({ menuItem: z.string() }),
//     streamSchema: z.string(),
//   },
//   async ({ theme }, { sendChunk }) => {
//     const { stream, response } = ai.generateStream({
//       model: googleAI.model('gemini-2.5-flash'),
//       prompt: `Summarize the task from a user: "${theme}" in to the required format: {type:[send, collect, helper, grocery], urgency: [ASAP, urgent, schedule]}`,
//     });

//     for await (const chunk of stream) {
//       sendChunk(chunk.text);
//     }

//     const { text } = await response;
//     return { menuItem: text };
//   }
// );

export const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.object({ theme: z.string() }),
    outputSchema: z.object({ menuItem: z.string() }),
    streamSchema: z.string(),
  },
  // async input => {
  //   const {output} = await generateRecipeFromIngredientsPrompt({
  //     ...input,
  //     localizationContext,
  //     language: input.language || 'en', // Default to English if not provided
  //   });
  //   if (!output) {
  //       throw new Error("The AI model did not return a valid response.");
  //   }
  //   return output;
  // }
  async ({ theme }, { sendChunk }) => {
    console.log(`Invent a menu item for a ${theme} themed restaurant.`)
    const { stream, response } = ai.generateStream({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Findv allvpet groomers in Cyberjaya.`,
      // prompt: `Invent a menu item for a ${theme} themed restaurant.`,
      // prompt: `What shoud a men wear to hackathon. Limit to 60 words`,
      // prompt: `Suggest a route form setiawangsa to cyberya avoiding toll and traffic at the same. Limit to 60 words`,
      // prompt: `Find a 1 house for rent in cyberjaya that match my salary of RM3000. I have Rm2000 commitment. Show me the property name or condo name. Limit to 60 words`,
      // prompt: `Summarize the task from a user: "${theme}" in to the required format: {type:[send, collect, helper, grocery], urgency: [ASAP, urgent, schedule]}`,


    });

    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }

    const { text } = await response;
    return { menuItem: text };
  }
);

// const prompt = ai.definePrompt({
//   name: 'validateIngredientsPrompt',
//   input: {schema: ValidateIngredientsWithDietaryNeedsInputSchema},
//   output: {schema: ValidateIngredientsWithDietaryNeedsOutputSchema},
//   prompt: `You are an expert nutritionist. Your task is to validate if a given list of ingredients is compliant with a specific dietary restriction.

//   Ingredients: {{{ingredients}}}
//   Dietary Restriction: {{{dietaryRestrictions}}}

//   Analyze the ingredients. If any ingredient violates the dietary restriction, set 'isValid' to false and provide a simple, clear 'reason' explaining the conflict (e.g., "Milk is not a vegan ingredient."). If all ingredients are compliant, set 'isValid' to true and leave the reason empty.
//   `,
// });
