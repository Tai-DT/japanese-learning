(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[428],{2316:(e,n,s)=>{"use strict";s.d(n,{default:()=>l});var a=s(5155),t=s(2115);function l(){let[e,n]=(0,t.useState)([{role:"assistant",content:"こんにちは！日本語を練習しましょう。何か話したいことがありますか？\n(Xin ch\xe0o! H\xe3y c\xf9ng luyện tập tiếng Nhật. Bạn muốn n\xf3i về điều g\xec?)"}]),[s,l]=(0,t.useState)(""),[r,i]=(0,t.useState)(!1),[o,c]=(0,t.useState)("beginner"),d=(0,t.useRef)(null);(0,t.useEffect)(()=>{u()},[e]);let u=()=>{var e;null===(e=d.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},h=async e=>{if(e.preventDefault(),!s.trim())return;let a={role:"user",content:s};n(e=>[...e,a]),l(""),i(!0);try{let e="You are a Japanese language tutor. The user is at ".concat(o," level. \n      Always respond in simple Japanese followed by Vietnamese translation in parentheses. \n      Keep responses short and helpful."),a=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:s,context:e})});if(!a.ok)throw Error("API request failed with status ".concat(a.status));let t=(await a.json()).response,l={role:"assistant",content:t};n(e=>[...e,l])}catch(s){console.error("Error sending message:",s);let e={role:"assistant",content:"すみません、エラーが発生しました。もう一度お試しください。\n(Xin lỗi, đ\xe3 xảy ra lỗi. Vui l\xf2ng thử lại.)"};n(n=>[...n,e])}finally{i(!1)}};return(0,a.jsxs)("div",{className:"flex flex-col h-[600px] border rounded-lg",children:[(0,a.jsx)("div",{className:"border-b p-4",children:(0,a.jsxs)("div",{className:"flex justify-between items-center",children:[(0,a.jsx)("h2",{className:"font-bold",children:"Tr\xf2 Chuyện Tiếng Nhật"}),(0,a.jsxs)("select",{value:o,onChange:e=>c(e.target.value),className:"p-2 border rounded-md text-sm","aria-label":"Japanese proficiency level",children:[(0,a.jsx)("option",{value:"beginner",children:"Người mới bắt đầu"}),(0,a.jsx)("option",{value:"intermediate",children:"Trung cấp"}),(0,a.jsx)("option",{value:"advanced",children:"N\xe2ng cao"})]})]})}),(0,a.jsxs)("div",{className:"flex-1 p-4 overflow-y-auto",children:[e.map((e,n)=>(0,a.jsx)("div",{className:"mb-4 p-3 rounded-lg max-w-[80%] ".concat("user"===e.role?"bg-blue-100 ml-auto":"bg-gray-100 mr-auto"),children:(0,a.jsx)("pre",{className:"whitespace-pre-wrap font-sans",children:e.content})},n)),r&&(0,a.jsxs)("div",{className:"bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]",children:[(0,a.jsx)("span",{className:"inline-block animate-pulse",children:"●"}),(0,a.jsx)("span",{className:"inline-block animate-pulse delay-100",children:"●"}),(0,a.jsx)("span",{className:"inline-block animate-pulse delay-200",children:"●"})]}),(0,a.jsx)("div",{ref:d})]}),(0,a.jsx)("form",{onSubmit:h,className:"border-t p-4",children:(0,a.jsxs)("div",{className:"flex",children:[(0,a.jsx)("input",{type:"text",value:s,onChange:e=>l(e.target.value),placeholder:"Nhập tin nhắn bằng tiếng Anh hoặc tiếng Nhật...",className:"flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:r}),(0,a.jsx)("button",{type:"submit",disabled:r||!s.trim(),className:"bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors",children:"Gửi"})]})})]})}},4287:(e,n,s)=>{Promise.resolve().then(s.bind(s,2316))}},e=>{var n=n=>e(e.s=n);e.O(0,[441,684,358],()=>n(4287)),_N_E=e.O()}]);