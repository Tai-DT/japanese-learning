(()=>{var e={};e.id=535,e.ids=[535],e.modules={649:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>x,routeModule:()=>d,serverHooks:()=>h,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>m});var a={};t.r(a),t.d(a,{POST:()=>g});var n=t(6559),o=t(8088),s=t(7719),i=t(2190),l=t(9150),c=t(762);let u=c.z.object({text:c.z.string().min(1).max(1e3),sourceLang:c.z.string().min(2).max(5),targetLang:c.z.string().min(2).max(5)});async function g(e){try{let r=await e.json(),t=u.parse(r),a=await (0,l.sS)(t.text,t.sourceLang,t.targetLang);return i.NextResponse.json({translatedText:a},{status:200})}catch(e){if(console.error("Translation error:",e),e instanceof c.z.ZodError)return i.NextResponse.json({error:"Invalid request data"},{status:400});return i.NextResponse.json({error:"Failed to translate text"},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/ai/translate/route",pathname:"/api/ai/translate",filename:"route",bundlePath:"app/api/ai/translate/route"},resolvedPagePath:"/Users/mac/Code/japanese-learning/app/api/ai/translate/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:p,workUnitAsyncStorage:m,serverHooks:h}=d;function x(){return(0,s.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:m})}},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9150:(e,r,t)=>{"use strict";t.d(r,{BL:()=>d,W9:()=>g,qX:()=>p,sS:()=>u,zv:()=>c});var a=t(7449);let n=process.env.GOOGLE_AI_API_KEY,o=new a.ij(n),s=[{category:a.DE.HARM_CATEGORY_HARASSMENT,threshold:a.vk.BLOCK_MEDIUM_AND_ABOVE},{category:a.DE.HARM_CATEGORY_HATE_SPEECH,threshold:a.vk.BLOCK_MEDIUM_AND_ABOVE}],i="gemini-2.0-flash";function l(e){try{return JSON.parse(e.trim())}catch{let r=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/)||e.match(/({[\s\S]*?})/);if(!r)throw Error("Could not extract JSON from the response");let t=r[1]||r[0];try{return JSON.parse(t.trim())}catch(e){throw Error(`Failed to parse extracted JSON: ${e instanceof Error?e.message:"Unknown error"}`)}}}async function c(e,r=""){try{let t;let a=o.getGenerativeModel({model:i,safetySettings:s});t=r?`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Previous conversation:
${r}

New message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`:`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`;let n=await a.generateContent({contents:[{role:"user",parts:[{text:t}]}]});if(!n||!n.response)throw Error("Invalid AI response");return n.response.text()}catch(e){throw console.error("Error chatting with AI:",e),Error(`Failed to generate response from AI: ${e instanceof Error?e.message:"Unknown error"}`)}}async function u(e,r="en",t="ja"){try{let a=o.getGenerativeModel({model:i,safetySettings:s}),n=`Translate the following text from ${r} to ${t}.
    
Input text: "${e}"

Rules:
1. Provide ONLY the translation, with no explanations or additional text
2. Maintain the original tone and formality level
3. Preserve proper names as they are unless they have standard translations
4. Ensure natural sounding output in the target language

Translation:`,l=await a.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!l||!l.response)throw Error("Invalid AI response");return l.response.text().trim()}catch(e){throw console.error("Error translating text:",e),Error("Failed to translate text")}}async function g(e){try{let r=o.getGenerativeModel({model:i,safetySettings:s}),t=`Analyze this Japanese kanji character: ${e}

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
Do not include any explanations or text outside the JSON object.`,a=await r.generateContent({contents:[{role:"user",parts:[{text:t}]}]});if(!a||!a.response)throw Error("Invalid AI response");let n=a.response.text();return l(n)}catch(e){throw console.error("Error analyzing kanji:",e),Error("Failed to analyze kanji")}}async function d(e){try{if(!e)throw Error("No image data provided");let r="image/png";e.startsWith("data:image/jpeg")?r="image/jpeg":e.startsWith("data:image/jpg")&&(r="image/jpg");let t=e.replace(/^data:image\/(png|jpeg|jpg);base64,/,"");if(!t||t.length<100)throw Error("Invalid or empty image data");console.log(`Processing image with MIME type: ${r}, data length: ${t.length}`);let a={inlineData:{data:t,mimeType:r}},n=`Analyze the kanji character in this image and return ONLY a valid JSON object with this structure:
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
  
  Do not include any text outside the JSON object.`,c=o.getGenerativeModel({model:i,generationConfig:{temperature:.1,topP:.95,topK:32,maxOutputTokens:2048},safetySettings:s});console.log("Sending request to AI model...");let u=await c.generateContent({contents:[{role:"user",parts:[{text:n},a]}]});if(!u||!u.response)throw Error("Empty response from AI model");let g=u.response;console.log("Received response from AI model");let d=g.text();console.log("Response text length:",d.length);try{let e=l(d);if(!e||!e.character)throw console.error("Invalid kanji data structure:",e),Error("Invalid kanji data: missing character");return e}catch(e){throw console.error("JSON parsing error:",e),console.error("Raw response:",d),Error(`Failed to parse AI response: ${e instanceof Error?e.message:"Unknown error"}`)}}catch(e){throw console.error("Error recognizing kanji from image:",e),Error(`Failed to analyze kanji image: ${e instanceof Error?e.message:"Unknown error"}`)}}async function p(e="",r="N5",t=6){try{let a=o.getGenerativeModel({model:i,safetySettings:s}),n=`Generate ${t} accurate Japanese vocabulary items ${e?"related to '"+e+"'":""} 
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
6. Return ONLY the JSON array, no explanations or additional text`,c=await a.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!c||!c.response)throw Error("Invalid AI response");let u=c.response.text();return l(u)}catch(e){throw console.error("Error generating vocabulary:",e),Error("Failed to generate vocabulary data")}}},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[447,580,778],()=>t(649));module.exports=a})();