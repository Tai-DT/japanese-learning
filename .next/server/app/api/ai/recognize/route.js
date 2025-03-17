(()=>{var e={};e.id=33,e.ids=[33],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4356:(e,r,a)=>{"use strict";a.r(r),a.d(r,{patchFetch:()=>x,routeModule:()=>g,serverHooks:()=>h,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>m});var t={};a.r(t),a.d(t,{POST:()=>d});var n=a(6559),o=a(8088),s=a(7719),i=a(2190),l=a(9150),c=a(762);let u=c.z.object({kanjiCharacter:c.z.string().min(1).max(1)});async function d(e){try{let r=await e.json(),a=u.parse(r);if(!/[\u4e00-\u9faf]/.test(a.kanjiCharacter))return i.NextResponse.json({error:"Invalid input",message:"The provided character is not a kanji"},{status:400});let t=new Promise((e,r)=>{setTimeout(()=>r(Error("Request timed out")),1e4)}),n=await Promise.race([(0,l.W9)(a.kanjiCharacter),t]);return i.NextResponse.json({kanji:n},{status:200})}catch(r){if(console.error("Kanji recognition error:",r),r instanceof c.z.ZodError)return i.NextResponse.json({error:"Invalid request data",details:r.errors},{status:400});let e=r instanceof Error?r.message:"Unknown error occurred";return i.NextResponse.json({error:"Failed to recognize kanji",message:e},{status:500})}}let g=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/ai/recognize/route",pathname:"/api/ai/recognize",filename:"route",bundlePath:"app/api/ai/recognize/route"},resolvedPagePath:"/Users/mac/Code/japanese-learning/app/api/ai/recognize/route.ts",nextConfigOutput:"",userland:t}),{workAsyncStorage:p,workUnitAsyncStorage:m,serverHooks:h}=g;function x(){return(0,s.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:m})}},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9150:(e,r,a)=>{"use strict";a.d(r,{BL:()=>g,W9:()=>d,qX:()=>p,sS:()=>u,zv:()=>c});var t=a(7449);let n=process.env.GOOGLE_AI_API_KEY,o=new t.ij(n),s=[{category:t.DE.HARM_CATEGORY_HARASSMENT,threshold:t.vk.BLOCK_MEDIUM_AND_ABOVE},{category:t.DE.HARM_CATEGORY_HATE_SPEECH,threshold:t.vk.BLOCK_MEDIUM_AND_ABOVE}],i="gemini-2.0-flash";function l(e){try{return JSON.parse(e.trim())}catch{let r=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/)||e.match(/({[\s\S]*?})/);if(!r)throw Error("Could not extract JSON from the response");let a=r[1]||r[0];try{return JSON.parse(a.trim())}catch(e){throw Error(`Failed to parse extracted JSON: ${e instanceof Error?e.message:"Unknown error"}`)}}}async function c(e,r=""){try{let a;let t=o.getGenerativeModel({model:i,safetySettings:s});a=r?`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Previous conversation:
${r}

New message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`:`You are a helpful Japanese language assistant. Respond in the same language the user is using.

Message from user: ${e}

Give a clear, accurate response without unnecessary explanations unless requested.`;let n=await t.generateContent({contents:[{role:"user",parts:[{text:a}]}]});if(!n||!n.response)throw Error("Invalid AI response");return n.response.text()}catch(e){throw console.error("Error chatting with AI:",e),Error(`Failed to generate response from AI: ${e instanceof Error?e.message:"Unknown error"}`)}}async function u(e,r="en",a="ja"){try{let t=o.getGenerativeModel({model:i,safetySettings:s}),n=`Translate the following text from ${r} to ${a}.
    
Input text: "${e}"

Rules:
1. Provide ONLY the translation, with no explanations or additional text
2. Maintain the original tone and formality level
3. Preserve proper names as they are unless they have standard translations
4. Ensure natural sounding output in the target language

Translation:`,l=await t.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!l||!l.response)throw Error("Invalid AI response");return l.response.text().trim()}catch(e){throw console.error("Error translating text:",e),Error("Failed to translate text")}}async function d(e){try{let r=o.getGenerativeModel({model:i,safetySettings:s}),a=`Analyze this Japanese kanji character: ${e}

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
Do not include any explanations or text outside the JSON object.`,t=await r.generateContent({contents:[{role:"user",parts:[{text:a}]}]});if(!t||!t.response)throw Error("Invalid AI response");let n=t.response.text();return l(n)}catch(e){throw console.error("Error analyzing kanji:",e),Error("Failed to analyze kanji")}}async function g(e){try{if(!e)throw Error("No image data provided");let r="image/png";e.startsWith("data:image/jpeg")?r="image/jpeg":e.startsWith("data:image/jpg")&&(r="image/jpg");let a=e.replace(/^data:image\/(png|jpeg|jpg);base64,/,"");if(!a||a.length<100)throw Error("Invalid or empty image data");console.log(`Processing image with MIME type: ${r}, data length: ${a.length}`);let t={inlineData:{data:a,mimeType:r}},n=`Analyze the kanji character in this image and return ONLY a valid JSON object with this structure:
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
  
  Do not include any text outside the JSON object.`,c=o.getGenerativeModel({model:i,generationConfig:{temperature:.1,topP:.95,topK:32,maxOutputTokens:2048},safetySettings:s});console.log("Sending request to AI model...");let u=await c.generateContent({contents:[{role:"user",parts:[{text:n},t]}]});if(!u||!u.response)throw Error("Empty response from AI model");let d=u.response;console.log("Received response from AI model");let g=d.text();console.log("Response text length:",g.length);try{let e=l(g);if(!e||!e.character)throw console.error("Invalid kanji data structure:",e),Error("Invalid kanji data: missing character");return e}catch(e){throw console.error("JSON parsing error:",e),console.error("Raw response:",g),Error(`Failed to parse AI response: ${e instanceof Error?e.message:"Unknown error"}`)}}catch(e){throw console.error("Error recognizing kanji from image:",e),Error(`Failed to analyze kanji image: ${e instanceof Error?e.message:"Unknown error"}`)}}async function p(e="",r="N5",a=6){try{let t=o.getGenerativeModel({model:i,safetySettings:s}),n=`Generate ${a} accurate Japanese vocabulary items ${e?"related to '"+e+"'":""} 
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
6. Return ONLY the JSON array, no explanations or additional text`,c=await t.generateContent({contents:[{role:"user",parts:[{text:n}]}]});if(!c||!c.response)throw Error("Invalid AI response");let u=c.response.text();return l(u)}catch(e){throw console.error("Error generating vocabulary:",e),Error("Failed to generate vocabulary data")}}},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../../../../webpack-runtime.js");r.C(e);var a=e=>r(r.s=e),t=r.X(0,[447,580,778],()=>a(4356));module.exports=t})();