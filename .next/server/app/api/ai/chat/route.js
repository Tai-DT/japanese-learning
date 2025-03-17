(()=>{var e={};e.id=337,e.ids=[337],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},6647:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>f,routeModule:()=>g,serverHooks:()=>x,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>h});var a={};t.r(a),t.d(a,{POST:()=>p});var n=t(6559),s=t(8088),o=t(7719),i=t(2190),l=t(9150),c=t(762);let u=c.z.object({message:c.z.string().min(1,"Message is required").max(1e3,"Message too long, max 1000 characters"),context:c.z.string().optional()}),d="Xin lỗi, t\xf4i đang gặp vấn đề kỹ thuật. Vui l\xf2ng thử lại sau một l\xe1t.";async function p(e){try{let r,t;let a=e.headers.get("content-type");if(!a||!a.includes("application/json"))return i.NextResponse.json({error:"Content-Type must be application/json"},{status:415});try{r=await e.json()}catch{return i.NextResponse.json({error:"Invalid JSON in request body"},{status:400})}try{t=u.parse(r)}catch(e){if(e instanceof c.z.ZodError){let r=e.errors.map(e=>`${e.path}: ${e.message}`).join(", ");return i.NextResponse.json({error:"Invalid request data",details:r},{status:400})}throw e}let n=new Promise((e,r)=>{setTimeout(()=>r(Error("Request timed out")),15e3)});try{let e=await Promise.race([(0,l.zv)(t.message,t.context),n]);return i.NextResponse.json({response:e,success:!0},{status:200})}catch(r){if(r instanceof Error&&"Request timed out"===r.message)return i.NextResponse.json({error:"Request timeout",fallbackResponse:d},{status:504});console.error("Chat API error details:",r);let e=r instanceof Error?r.message:String(r);if(e.includes("429")||e.includes("rate limit")||e.includes("exhausted")||e.includes("quota"))return i.NextResponse.json({error:"API rate limited",message:"API rate limit reached. Please try again in a few minutes.",fallbackResponse:d},{status:429});if(e.includes("404")||e.includes("not found")||e.includes("generateContent"))return i.NextResponse.json({error:"AI models unavailable",message:"The requested AI model is currently unavailable",fallbackResponse:d},{status:503});return i.NextResponse.json({error:"Failed to generate response",fallbackResponse:d},{status:500})}}catch(e){return console.error("Unhandled exception in chat API:",e),i.NextResponse.json({error:"Server error",fallbackResponse:d},{status:500})}}let g=new n.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:"app/api/ai/chat/route"},resolvedPagePath:"/Users/mac/Code/japanese-learning/app/api/ai/chat/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:m,workUnitAsyncStorage:h,serverHooks:x}=g;function f(){return(0,o.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:h})}},8335:()=>{},9150:(e,r,t)=>{"use strict";t.d(r,{BL:()=>p,W9:()=>d,qX:()=>g,sS:()=>u,zv:()=>c});var a=t(7449);let n=process.env.GOOGLE_AI_API_KEY,s=new a.ij(n),o=[{category:a.DE.HARM_CATEGORY_HARASSMENT,threshold:a.vk.BLOCK_MEDIUM_AND_ABOVE},{category:a.DE.HARM_CATEGORY_HATE_SPEECH,threshold:a.vk.BLOCK_MEDIUM_AND_ABOVE}],i="gemini-2.0-flash";function l(e){try{return JSON.parse(e.trim())}catch{let r=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/)||e.match(/({[\s\S]*?})/);if(!r)throw Error("Could not extract JSON from the response");let t=r[1]||r[0];try{return JSON.parse(t.trim())}catch(e){throw Error(`Failed to parse extracted JSON: ${e instanceof Error?e.message:"Unknown error"}`)}}}async function c(e,r=""){try{let t;let a=s.getGenerativeModel({model:i,safetySettings:o});t=r?`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Previous conversation:
${r}

New message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`:`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`;let n=await a.generateContent({contents:[{role:"user",parts:[{text:t}]}]});if(!n||!n.response)throw Error("Invalid AI response");return n.response.text()}catch(e){throw console.error("Error chatting with AI:",e),Error(`Failed to generate response from AI: ${e instanceof Error?e.message:"Unknown error"}`)}}async function u(e,r="en",t="ja"){try{let a=s.getGenerativeModel({model:i,safetySettings:o}),n=`Translate the following text from ${r} to ${t}.
    
Input text: "${e}"

Rules:
1. Provide ONLY the translation, with no explanations or additional text
2. Maintain the original tone and formality level
3. Preserve proper names as they are unless they have standard translations
4. Ensure natural sounding output in the target language

Translation:`,l=await a.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!l||!l.response)throw Error("Invalid AI response");return l.response.text().trim()}catch(e){throw console.error("Error translating text:",e),Error("Failed to translate text")}}async function d(e){try{let r=s.getGenerativeModel({model:i,safetySettings:o}),t=`Analyze this Japanese kanji character: ${e}

Return ONLY a valid JSON object with EXACTLY this structure and nothing else:
{
  "character": "${e}",
  "onReading": ["Array of ON readings in katakana"],
  "kunReading": ["Array of KUN readings in hiragana"],
  "meaning": ["Array of Vietnamese meanings"],
  "strokeCount": number,
  "jlptLevel": "N5/N4/N3/N2/N1",
  "examples": [
    {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"},
    {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"}
  ]
}

Include common and useful examples. Make sure all Japanese text is properly formatted with correct kana.
Do not include any explanations or text outside the JSON object.`,a=await r.generateContent({contents:[{role:"user",parts:[{text:t}]}]});if(!a||!a.response)throw Error("Invalid AI response");let n=a.response.text();return l(n)}catch(e){throw console.error("Error analyzing kanji:",e),Error("Failed to analyze kanji")}}async function p(e){try{if(!e)throw Error("No image data provided");let r="image/png";e.startsWith("data:image/jpeg")?r="image/jpeg":e.startsWith("data:image/jpg")&&(r="image/jpg");let t=e.replace(/^data:image\/(png|jpeg|jpg);base64,/,"");if(!t||t.length<100)throw Error("Invalid or empty image data");console.log(`Processing image with MIME type: ${r}, data length: ${t.length}`);let a={inlineData:{data:t,mimeType:r}},n=`Analyze the kanji character in this image and return ONLY a valid JSON object with this structure:
  {
    "character": "the kanji character",
    "onReading": ["Array of ON readings in katakana"],
    "kunReading": ["Array of KUN readings in hiragana"],
    "meaning": ["Array of Vietnamese meanings"],
    "strokeCount": number,
    "jlptLevel": "N5/N4/N3/N2/N1",
    "examples": [
      {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"},
      {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"}
    ]
  }
  
  Do not include any text outside the JSON object.`,c=s.getGenerativeModel({model:i,generationConfig:{temperature:.1,topP:.95,topK:32,maxOutputTokens:2048},safetySettings:o});console.log("Sending request to AI model...");let u=await c.generateContent({contents:[{role:"user",parts:[{text:n},a]}]});if(!u||!u.response)throw Error("Empty response from AI model");let d=u.response;console.log("Received response from AI model");let p=d.text();console.log("Response text length:",p.length);try{let e=l(p);if(!e||!e.character)throw console.error("Invalid kanji data structure:",e),Error("Invalid kanji data: missing character");return e}catch(e){throw console.error("JSON parsing error:",e),console.error("Raw response:",p),Error(`Failed to parse AI response: ${e instanceof Error?e.message:"Unknown error"}`)}}catch(e){throw console.error("Error recognizing kanji from image:",e),Error(`Failed to analyze kanji image: ${e instanceof Error?e.message:"Unknown error"}`)}}async function g(e="",r="N5",t=6){try{let a=s.getGenerativeModel({model:i,safetySettings:o}),n=`Generate ${t} accurate Japanese vocabulary items ${e?"related to '"+e+"'":""} 
for JLPT level ${"all"===r?"N5 to N1":r}.

RESPONSE FORMAT: Return ONLY a valid JSON array with EXACTLY this structure:
[
  {
    "id": "1",
    "japanese": "単語",
    "hiragana": "たんご",
    "romaji": "tango",
    "meaning": "Precise Vietnamese translation",
    "example": {
      "japanese": "Natural Japanese example sentence with correct grammar",
      "meaning": "Accurate Vietnamese translation of the example"
    },
    "level": "${"all"===r?"N5/N4/N3/N2/N1":r}"
  },
  {... next item}
]

IMPORTANT RULES:
1. Ensure all vocabulary is actually at the specified JLPT level
2. Provide accurate hiragana readings and romaji
3. Include natural, useful example sentences
4. Ensure all Japanese text uses correct characters and grammar
5. Maintain the exact JSON structure requested
6. Return ONLY the JSON array, no explanations or additional text`,c=await a.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!c||!c.response)throw Error("Invalid AI response");let u=c.response.text();return l(u)}catch(e){throw console.error("Error generating vocabulary:",e),Error("Failed to generate vocabulary data")}}},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[447,580,778],()=>t(6647));module.exports=a})();