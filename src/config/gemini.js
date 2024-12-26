import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCmzV1YPhk1YLliWTKZ0q9aRuslFNYlFyg");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const commonGenerationConfig = {
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


async function run(prompt, options = {}) {
  // default values
  const { temperature=0.7, lengthType='medium' } = options;
  let modifiedPrompt = prompt;

  // Add modifiers based on lengthType
  switch(lengthType){
    case 'short':
     modifiedPrompt = `Give a short and concise answer for this prompt: ${prompt}`;
     break;
    case 'medium':
      modifiedPrompt = `Give a medium length answer of about 100 words for this prompt: ${prompt}`
    break;
     case 'long':
      modifiedPrompt = `Provide a full and detailed answer for this prompt: ${prompt}`
     break;
    default:
      modifiedPrompt =  `Give a short and concise answer for this prompt: ${prompt}`
  }

  const generationConfig = {
    ...commonGenerationConfig,
    temperature: temperature,
  };


  const chat = model.startChat({
    generationConfig,
    history: [],
  });


  try{
      const result = await chat.sendMessage(modifiedPrompt);
      return result.response.text()
  }catch(error){
      console.log(`Error: ${error}`)
      return "Something went wrong. Please try again later."
  }
}


export default run;