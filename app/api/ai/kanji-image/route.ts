import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAIFileManager } from "@/lib/google-ai-file-manager";

// Khởi tạo Google Gemini AI với API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const MODEL_NAME = "gemini-2.0-flash-exp-image-generation";

// Định nghĩa kiểu dữ liệu cho content parts
interface TextPart {
  text: string;
}

interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

type ContentPart = TextPart | InlineDataPart;

interface ContentItem {
  role: string;
  parts: ContentPart[];
}

export async function POST(req: NextRequest) {
  // Lưu một bản sao của request để có thể đọc lại nếu cần
  const clonedReq = req.clone();
  
  try {
    const formData = await req.formData();
    const kanji = formData.get("kanji") as string;
    const prompt = formData.get("prompt") as string;
    const fileData = formData.get("image") as File | null;

    if (!kanji && !fileData) {
      return NextResponse.json(
        { error: "Cần có Kanji hoặc hình ảnh để xử lý" },
        { status: 400 }
      );
    }

    // Nhận dạng Kanji nếu người dùng tải lên hình ảnh nhưng không cung cấp Kanji
    let recognizedKanji = "";
    if (fileData && !kanji) {
      try {
        console.log("Đang nhận dạng Kanji từ hình ảnh...");
        // Tối ưu hình ảnh trước khi nhận dạng
        const optimizedFile = await GoogleAIFileManager.optimizeImage(fileData);
        const recognitionPart = await GoogleAIFileManager.fileToPart(optimizedFile);
        
        // Gửi hình ảnh đến Gemini để nhận dạng Kanji
        const recognitionModel = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 10,
            maxOutputTokens: 1024,
          }
        });
        
        const recognitionResult = await recognitionModel.generateContent({
          contents: [{ 
            role: "user", 
            parts: [
              recognitionPart,
              { text: "Nhận dạng ký tự Kanji trong hình ảnh này và trả về chỉ ký tự Kanji đó, không có text nào khác." }
            ] 
          }],
        });

        recognizedKanji = recognitionResult.response.text().trim();
        console.log("Nhận dạng Kanji thành công:", recognizedKanji);
      } catch (recognitionError) {
        console.error("Lỗi khi nhận dạng Kanji:", recognitionError);
      }
    }

    // Sử dụng Kanji đã nhận dạng nếu có, nếu không sử dụng Kanji đã nhập
    const effectiveKanji = recognizedKanji || kanji;

    // Tạo prompt chi tiết và tối ưu cho việc sinh hình ảnh
    const defaultPrompt = 
      "Hãy thực hiện quy trình phân tích và tạo hình ảnh như sau:\n\n" +
      "PHẦN 1: PHÂN TÍCH KANJI CHI TIẾT\n" +
      "- Phân tích cấu trúc hình học của Kanji: các bộ thủ, số nét, thứ tự viết\n" + 
      "- Giải thích nguồn gốc và sự phát triển của Kanji qua thời gian\n" +
      "- Liệt kê TẤT CẢ các ý nghĩa khác nhau của Kanji này\n" +
      "- Phân tích sâu mối liên hệ giữa HÌNH DÁNG của Kanji và Ý NGHĨA của nó\n" +
      "- Tìm các từ vựng tiêu biểu có chứa Kanji này\n\n" +
      
      "PHẦN 2: CHỌN LỌC Ý NGHĨA PHÙ HỢP NHẤT\n" +
      "- Chọn 1-2 ý nghĩa CÓ MỐI LIÊN HỆ TRỰC QUAN RÕ RÀNG NHẤT với hình dáng của Kanji\n" +
      "- Phân tích tại sao ý nghĩa được chọn là phù hợp nhất cho việc minh họa trực quan\n" +
      "- Mô tả chi tiết cách thức chuyển đổi từ hình dáng Kanji sang hình ảnh minh họa\n" +
      "- Lựa chọn 1-2 từ vựng tiêu biểu nhất có chứa Kanji này để minh họa\n\n" +
      
      "PHẦN 3: TẠO HÌNH ẢNH MINH HỌA THEO Ý NGHĨA ĐÃ CHỌN\n" +
      "Tạo một hình ảnh minh họa với các đặc điểm sau:\n" +
      "1. TUYỆT ĐỐI PHẢI TẠO HÌNH ẢNH CÓ HÌNH DÁNG GIỐNG VỚI KANJI: Các đối tượng trong hình sắp xếp theo cấu trúc của Kanji\n" +
      "2. THỂ HIỆN TRỰC QUAN Ý NGHĨA ĐÃ CHỌN: Hình ảnh phải thể hiện rõ ràng ý nghĩa đã chọn ở phần 2\n" +
      "3. SỬ DỤNG ĐỐI TƯỢNG TƯƠNG ĐỒNG: Mỗi nét của Kanji được thay thế bằng đối tượng thực tế có hình dáng tương tự\n" +
      "4. MINH HỌA TỪ VỰNG ĐÃ CHỌN: Đưa vào hình ảnh các yếu tố minh họa từ vựng tiêu biểu đã chọn\n" +
      "5. SỬ DỤNG CÁCH TIẾP CẬN XUYÊN VĂN HÓA: Kết hợp yếu tố văn hóa Nhật Bản và Việt Nam để tăng khả năng ghi nhớ\n" +
      "6. TẠO LIÊN KẾT MNEMONIC: Thiết kế hình ảnh tạo ra các liên kết trí nhớ giữa hình dáng Kanji và ý nghĩa\n\n" +
      
      "YÊU CẦU BẮT BUỘC:\n" +
      "1. Hình ảnh PHẢI có cấu trúc trực quan GIỐNG với hình dáng của Kanji, không chỉ là một hình minh họa thông thường\n" +
      "2. Phải tạo được mối liên hệ trực tiếp GIỮA HÌNH DÁNG của Kanji VÀ Ý NGHĨA của nó\n" +
      "3. Các đối tượng trong hình ảnh phải được sắp xếp để khi nhìn tổng thể, người học có thể thấy hình dáng của Kanji\n" +
      "4. Sử dụng màu sắc có ý nghĩa: mỗi màu được chọn phải liên quan đến khía cạnh ý nghĩa nào đó của Kanji\n" +
      "5. Tạo ra các yếu tố giúp ghi nhớ không chỉ hình dáng, mà còn cả ý nghĩa và phát âm của Kanji";

    // Tạo prompt dựa trên Kanji và prompt người dùng (nếu có)
    const promptText = effectiveKanji
      ? `Phân tích sâu và tạo hình ảnh minh họa cho ký tự Kanji: ${effectiveKanji}. ${prompt || defaultPrompt}`
      : `Hãy nhận diện ký tự Kanji trong hình ảnh, sau đó phân tích sâu và tạo hình ảnh minh họa cho nó. ${prompt || defaultPrompt}`;

    // Gọi trực tiếp API để tạo hình ảnh với cấu trúc tương tự như Python
    const apiKey = process.env.GOOGLE_AI_API_KEY || "";
    const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
    
    // Chuẩn bị nội dung cho request
    const contents: ContentItem[] = [
      {
        role: "user",
        parts: [
          { text: promptText }
        ]
      }
    ];
    
    // Nếu có file hình ảnh và KHÔNG có Kanji nhận dạng, thêm hình ảnh vào request
    // Nếu đã nhận dạng được Kanji, chúng ta không cần gửi hình ảnh nữa vì đã có text prompt
    if (fileData && !effectiveKanji) {
      // Tối ưu hình ảnh trước khi gửi
      const optimizedFile = await GoogleAIFileManager.optimizeImage(fileData);
      const imageBase64 = await GoogleAIFileManager.fileToBase64(optimizedFile);
      const mimeType = optimizedFile.type || 'image/png';
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      
      // Thêm hình ảnh vào prompt
      contents[0].parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }
    
    // Cấu hình tạo hình ảnh
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseModalities: ["image", "text"],
      responseMimeType: "text/plain",
    };
    
    // Cài đặt an toàn
    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold: "OFF"
      }
    ];

    console.log("Đang gửi yêu cầu tạo hình ảnh minh họa cho Kanji:", effectiveKanji);
    
    // Chuẩn bị request body
    const requestBody = {
      contents: contents,
      generationConfig: generationConfig,
      safetySettings: safetySettings
    };
    
    // Gửi request tới API
    const endpoint = `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Phản hồi từ API - status:", response.status);
    
    // Lấy phản hồi dưới dạng text để debug chi tiết
    const responseText = await response.text();
    console.log("Phản hồi từ API (độ dài):", responseText.length);
    
    // Parse JSON response nếu hợp lệ
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Lỗi parse JSON:", parseError);
      console.error("Phản hồi gốc:", responseText.substring(0, 500) + "...");
      throw new Error(`Lỗi định dạng phản hồi: ${parseError instanceof Error ? parseError.message : "Không xác định"}`);
    }
    
    // Kiểm tra lỗi từ API
    if (!response.ok) {
      console.error("Lỗi API Gemini:", data);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    console.log("Cấu trúc phản hồi:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
    
    // Kiểm tra phản hồi từ API
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Phản hồi trống từ API Gemini:", data);
      throw new Error("No candidates in Gemini API response");
    }
    
    const candidate = data.candidates[0];
    
    // Kiểm tra lỗi an toàn
    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      console.warn(`Gemini API kết thúc với lý do: ${candidate.finishReason}`);
      if (candidate.finishReason === "SAFETY") {
        throw new Error("Nội dung bị chặn bởi cài đặt an toàn");
      }
      // Xử lý đặc biệt cho lỗi IMAGE_SAFETY
      if (candidate.finishReason === "IMAGE_SAFETY") {
        console.log("Hình ảnh bị chặn bởi cài đặt an toàn, đang thử phương pháp thay thế...");
        
        try {
          // Thử dùng model khác để tạo ảnh
          console.log("Đang thử tạo lại hình ảnh với model thay thế...");
          
          const altModel = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
              temperature: 0.4,
              topP: 0.8,
              topK: 16,
              maxOutputTokens: 2048
            }
          });
          
          const altPrompt = `Hãy vẽ một hình ảnh đơn giản, phù hợp cho trẻ em minh họa chữ Kanji: ${effectiveKanji}. 
          Hình ảnh nên dễ hiểu, dễ nhớ và thích hợp cho mọi đối tượng. Tuyệt đối không có nội dung nhạy cảm.`;
          
          const altResult = await altModel.generateContent(altPrompt);
          const altText = altResult.response.text();
          
          // Tìm dữ liệu base64 trong phản hồi
          const altBase64Match = altText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
          if (altBase64Match) {
            return new Response(
              JSON.stringify({
                imageUrl: altBase64Match[0],
                text: "Hình ảnh được tạo bằng phương pháp thay thế sau khi phương pháp chính bị chặn bởi cài đặt an toàn."
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          } else {
            throw new Error("Không thể tạo hình ảnh vì lý do an toàn. Vui lòng thử một Kanji khác.");
          }
        } catch (altError) {
          console.error("Lỗi khi thử phương pháp thay thế:", altError);
          throw new Error("Không thể tạo hình ảnh vì lý do an toàn. Vui lòng thử một Kanji khác.");
        }
      }
    }
    
    // Kiểm tra cấu trúc phản hồi với xử lý lỗi chi tiết
    if (!candidate.content) {
      console.error("Không tìm thấy content trong phản hồi:", JSON.stringify(candidate, null, 2));
      // Thử loại model khác
      return await tryFallbackImageGeneration(effectiveKanji, "Phản hồi không có trường content");
    }
    
    if (!candidate.content.parts) {
      console.error("Không tìm thấy parts trong content:", JSON.stringify(candidate.content, null, 2));
      // Thử loại model khác
      return await tryFallbackImageGeneration(effectiveKanji, "Phản hồi không có trường parts");
    }
    
    if (candidate.content.parts.length === 0) {
      console.error("Mảng parts trống:", JSON.stringify(candidate.content.parts, null, 2));
      // Thử loại model khác
      return await tryFallbackImageGeneration(effectiveKanji, "Mảng parts trống");
    }
    
    console.log("Số lượng parts trong phản hồi:", candidate.content.parts.length);
    
    // Trích xuất phần hình ảnh (inlineData) và text từ phản hồi
    let imageData = "";
    let text = "";
    
    // Lặp qua từng phần trong phản hồi và log chi tiết
    console.log("Các loại parts trong phản hồi:");
    for (const part of candidate.content.parts) {
      // Log loại part
      if (part.text) console.log("- Tìm thấy text part");
      if (part.inlineData) console.log("- Tìm thấy inlineData part");
      if (part.fileData) console.log("- Tìm thấy fileData part");
      
      // Nếu phần là inlineData và là image
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
        const mimeType = part.inlineData.mimeType;
        const data = part.inlineData.data;
        imageData = `data:${mimeType};base64,${data}`;
        console.log("Tìm thấy dữ liệu hình ảnh trong phản hồi - mimeType:", mimeType);
      } 
      // Kiểm tra fileData (định dạng thay thế có thể có)
      else if (part.fileData && part.fileData.mimeType && part.fileData.mimeType.startsWith('image/')) {
        const mimeType = part.fileData.mimeType;
        const fileUri = part.fileData.fileUri;
        
        // Lấy dữ liệu từ fileUri nếu có
        if (fileUri) {
          try {
            console.log("Tìm thấy fileUri, đang truy xuất dữ liệu hình ảnh...");
            const fileResponse = await fetch(fileUri);
            if (fileResponse.ok) {
              const fileArrayBuffer = await fileResponse.arrayBuffer();
              const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');
              imageData = `data:${mimeType};base64,${fileBase64}`;
              console.log("Đã lấy hình ảnh từ fileUri thành công");
            }
          } catch (fileError) {
            console.error("Lỗi khi lấy dữ liệu từ fileUri:", fileError);
          }
        }
      }
      // Nếu phần là text
      else if (part.text) {
        text += part.text;
        console.log("Tìm thấy phần text, độ dài:", part.text.length);
      }
    }
    
    // Nếu không tìm thấy hình ảnh trực tiếp, thử tìm trong văn bản
    if (!imageData && text) {
      console.log("Không tìm thấy hình ảnh trực tiếp, đang tìm trong text...");
      // Các regex tìm kiếm hình ảnh base64 trong văn bản
      const base64Regex1 = /data:image\/[^;]+;base64,[^"'\s]+/;
      const base64Regex2 = /!\[image\]\((data:image\/[^;]+;base64,[^)]+)\)/;
      const base64Regex3 = /<img\s+src="(data:image\/[^;]+;base64,[^"]+)"/;
      const base64Regex4 = /\[Image: (data:image\/[^;]+;base64,[^\]]+)\]/;
      
      const match = text.match(base64Regex1) || 
                  text.match(base64Regex2)?.map(m => m[1]) ||
                  text.match(base64Regex3)?.map(m => m[1]) ||
                  text.match(base64Regex4)?.map(m => m[1]);
                  
      if (match) {
        imageData = match[0];
        console.log("Tìm thấy dữ liệu hình ảnh trong phản hồi text - độ dài:", imageData.length);
      }
    }

    // Thử giải pháp dự phòng: tạo lại hình ảnh với cấu hình khác nếu không tìm thấy
    if (!imageData && effectiveKanji) {
      try {
        console.log("Không tìm thấy hình ảnh, đang thử tạo lại với model sdk...");
        
        // Tạo lại hình ảnh với cấu hình khác
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048
          }
        });
        
        const simplifiedPrompt = `Tạo một hình ảnh minh họa trực quan cho chữ Kanji: ${effectiveKanji}. Hình ảnh nên thể hiện ý nghĩa của Kanji và giúp ghi nhớ cách viết.`;
        
        const fallbackResult = await fallbackModel.generateContent(simplifiedPrompt);
        const fallbackText = fallbackResult.response.text();
        
        // Tìm dữ liệu base64 trong phản hồi
        const base64Match = fallbackText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
        if (base64Match) {
          imageData = base64Match[0];
          console.log("Đã tạo lại hình ảnh thành công với model dự phòng");
        }
      } catch (fallbackError) {
        console.error("Lỗi khi thử tạo lại hình ảnh:", fallbackError);
      }
    }

    // Kiểm tra xem có hình ảnh không
    if (!imageData) {
      console.error("Vẫn không tìm thấy dữ liệu hình ảnh sau khi thử tất cả phương pháp");
      // Thử loại model khác như là phương pháp cuối cùng
      return await tryFallbackImageGeneration(effectiveKanji, "Không tìm thấy dữ liệu hình ảnh");
    }

    console.log("Thành công: Đã tạo hình ảnh minh họa cho Kanji", effectiveKanji);

    return NextResponse.json({ 
      imageData,
      recognizedKanji: effectiveKanji,
      generatedDescription: text,
      isError: false // Thêm flag để frontend biết đây không phải lỗi
    });
  } catch (error: unknown) {
    console.error("Lỗi khi xử lý Kanji:", error);
    
    // Sử dụng request đã clone để lấy lại kanji nếu cần
    let inputKanji = "";
    try {
      if (clonedReq) {
        const formData = await clonedReq.formData();
        inputKanji = formData.get("kanji") as string;
      }
    } catch (formError) {
      console.error("Không thể lấy lại kanji từ form data:", formError);
      // Xử lý lỗi không lấy được formData
    }
    
    // Thử phương pháp cuối cùng nếu có Kanji
    if (inputKanji) {
      try {
        console.log("Đang thử phương pháp dự phòng cuối cùng sau lỗi...");
        return await tryFallbackImageGeneration(inputKanji, "Lỗi trong quá trình chính");
      } catch (fallbackError) {
        console.error("Lỗi ở cả phương pháp dự phòng:", fallbackError);
        
        // Phương pháp cuối cùng - trả về một hình ảnh đơn giản từ thư viện
        try {
          return createSimpleKanjiImage(inputKanji);
        } catch (_simpleError) {
          console.error("Lỗi ở phương pháp đơn giản nhất:", _simpleError);
        }
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý Kanji";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Phương pháp tạo hình ảnh đơn giản khi tất cả phương pháp khác thất bại
async function createSimpleKanjiImage(kanji: string): Promise<Response> {
  console.log("Đang tạo hình ảnh đơn giản cho Kanji:", kanji);
  
  // Sử dụng ảnh mặc định từ thư viện hình ảnh
  const baseImageUrl = "https://placehold.co/400x300/f5f5f5/333333";
  const kanjiImageUrl = `${baseImageUrl}?text=${encodeURIComponent(kanji)}`;
  
  // Hoặc sử dụng hình ảnh mặc định từ folder public (nếu có)
  // const kanjiImageUrl = `/images/fallback-kanji.png`;
  
  return new Response(
    JSON.stringify({
      imageData: kanjiImageUrl, // Sử dụng URL thay vì base64
      recognizedKanji: kanji,
      generatedDescription: `Không thể tạo hình ảnh minh họa chi tiết cho Kanji "${kanji}". Đây là hình ảnh đơn giản thay thế.`,
      isError: false,
      isFallbackImage: true
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper function for generating fallback images with different approaches
async function tryFallbackImageGeneration(kanji: string, reason: string) {
  if (!kanji) {
    throw new Error("Không thể tạo hình ảnh khi không có Kanji");
  }
  
  console.log(`Đang thử phương pháp dự phòng. Lý do: ${reason}`);
  
  // Thử phương pháp siêu đơn giản - chỉ yêu cầu một hình ảnh với prompt ngắn
  try {
    const simpleModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation", 
      generationConfig: {
        temperature: 0.1,
        topP: 0.7,
        topK: 1,
        maxOutputTokens: 2048
      }
    });
    
    const minimalPrompt = `Vẽ một hình ảnh đơn giản cho chữ Kanji: ${kanji}`;
    
    console.log("Đang thử phương pháp siêu đơn giản với prompt ngắn...");
    const simpleResult = await simpleModel.generateContent(minimalPrompt);
    const simpleText = simpleResult.response.text();
    
    const simpleMatch = simpleText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (simpleMatch) {
      console.log("Đã tạo được hình ảnh với phương pháp siêu đơn giản");
      return new Response(
        JSON.stringify({
          imageData: simpleMatch[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh đơn giản cho Kanji."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (simpleError) {
    console.error("Lỗi khi thử phương pháp siêu đơn giản:", simpleError);
  }

  // Phương pháp kết hợp: Hình ảnh minh họa nghĩa và giữ cấu trúc của Kanji
  try {
    const combinedModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        topK: 24,
        maxOutputTokens: 4096
      }
    });
    
    const combinedPrompt = `Tạo một hình ảnh MINH HỌA SÁNG TẠO cho chữ Kanji: ${kanji}, với các yêu cầu sau:

    1. TÌM HIỂU NGHĨA của Kanji này và tạo một hình ảnh thể hiện nghĩa đó
    2. HÌNH ẢNH phải GIỐNG HÌNH DẠNG của chữ Kanji để dễ nhớ
    3. Sử dụng các ĐỐI TƯỢNG THỰC TẾ, sắp xếp theo hình dáng của Kanji
    
    Ví dụ: 
    - Kanji "山" (núi): Vẽ ba ngọn núi sắp xếp giống hình dạng của Kanji "山"
    - Kanji "水" (nước): Vẽ dòng nước chảy tạo thành hình dạng giống Kanji "水"
    - Kanji "木" (cây): Vẽ một cái cây với cành và rễ tạo hình giống Kanji "木"
    
    Hãy tạo một hình ảnh MÀU SẮC SINH ĐỘNG, NGHỆ THUẬT, và DỄ NHỚ, sao cho người học vừa hiểu được nghĩa vừa nhớ được hình dạng của Kanji.`;
    
    const combinedResult = await combinedModel.generateContent(combinedPrompt);
    const combinedText = combinedResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const combinedMatch = combinedText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (combinedMatch) {
      console.log("Đã tạo hình ảnh kết hợp nghĩa và hình dạng Kanji thành công");
      return new Response(
        JSON.stringify({
          imageData: combinedMatch[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh minh họa nghĩa kết hợp hình dạng của Kanji."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (combinedError) {
    console.error("Lỗi khi tạo hình ảnh kết hợp nghĩa và hình dạng:", combinedError);
  }
  
  // Phương pháp cho Kanji phức tạp hoặc trừu tượng
  try {
    const abstractModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 4096
      }
    });
    
    const abstractPrompt = `Tạo hình ảnh MINH HỌA TƯỢNG TRƯNG cho chữ Kanji: ${kanji}

    Đây là Kanji PHỨC TẠP hoặc TRỪU TƯỢNG, hãy thực hiện như sau:
    1. Tìm các từ khóa CHÍNH và TỪ LIÊN QUAN đến nghĩa của Kanji này
    2. Tạo một BIỂU TƯỢNG TRỰC QUAN dễ nhớ đại diện cho Kanji
    3. Sử dụng các YẾU TỐ TƯỢNG TRƯNG thay vì chỉ đối tượng thực tế
    4. Kết hợp CÁC HÌNH ẢNH ĐẠI DIỆN cho các thành phần của Kanji
    5. Tạo một BỐ CỤC SÁNG TẠO giúp nhớ hình dạng Kanji
    
    Hình ảnh phải CÓ NGHỆ THUẬT, TẠO ẤN TƯỢNG MẠNH, và GIÚP GHI NHỚ.`;
    
    const abstractResult = await abstractModel.generateContent(abstractPrompt);
    const abstractText = abstractResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const abstractMatch = abstractText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (abstractMatch) {
      console.log("Đã tạo hình ảnh tượng trưng cho Kanji trừu tượng thành công");
      return new Response(
        JSON.stringify({
          imageData: abstractMatch[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh tượng trưng minh họa khái niệm của Kanji."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (abstractError) {
    console.error("Lỗi khi tạo hình ảnh tượng trưng:", abstractError);
  }
  
  // Thử tạo hình ảnh minh họa nghĩa chính của Kanji - thực tế và dễ hiểu
  try {
    const meaningModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 16,
        maxOutputTokens: 4096
      }
    });
    
    const meaningPrompt = `Tạo một hình ảnh MINH HỌA TỪ NGHĨA CHÍNH cho chữ Kanji: ${kanji}.
    
    1. HÃY TÌM NGHĨA CHÍNH của Kanji này (nghĩa phổ biến và cụ thể nhất)
    2. VẼ MỘT HÌNH ẢNH THỰC TẾ, DỄ HIỂU minh họa nghĩa đó
    3. KHÔNG CỐ GẮNG làm cho hình dáng giống với Kanji
    4. SỬ DỤNG các đối tượng cụ thể, thực tế và dễ nhận biết
    5. Hình ảnh phải RÕ RÀNG, THỊ GIÁC ĐẸP, màu sắc hài hòa
    
    Ví dụ: Nếu Kanji có nghĩa "núi", hãy vẽ một ngọn núi đẹp, rõ ràng thay vì cố làm cho hình dáng giống với Kanji.`;
    
    const meaningResult = await meaningModel.generateContent(meaningPrompt);
    const response = meaningResult.response;
    
    // Lấy text từ phản hồi và tìm hình ảnh
    const meaningText = response.text();
    const base64Match = meaningText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (base64Match) {
      console.log("Đã tìm thấy hình ảnh từ phản hồi nghĩa chính");
      return new Response(
        JSON.stringify({
          imageData: base64Match[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh minh họa nghĩa chính của Kanji."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (meaningError) {
    console.error("Lỗi khi tạo hình ảnh minh họa nghĩa chính:", meaningError);
  }
  
  // Thử cách khác với gemini-1.5-pro - tập trung vào nghĩa thực tế
  try {
    const proModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 4096
      }
    });
    
    const simplePrompt = `Tạo một hình ảnh minh họa CHỈ VỀ Ý NGHĨA của chữ Kanji: ${kanji}.
    ĐỪNG cố gắng làm cho hình dáng giống với Kanji.
    Hãy tạo một hình ảnh đẹp, rõ ràng thể hiện ý nghĩa chính của Kanji.
    Trả về hình ảnh dưới dạng base64 image data.`;
    
    const proResult = await proModel.generateContent(simplePrompt);
    const proText = proResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const base64Match = proText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (base64Match) {
      console.log("Đã tạo hình ảnh minh họa ý nghĩa thành công với model pro");
      return new Response(
        JSON.stringify({
          imageData: base64Match[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh minh họa ý nghĩa của Kanji."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (proError) {
    console.error("Lỗi khi thử với model pro:", proError);
  }
  
  // Thử với model 1.0-pro-vision - thường ổn định nhất
  try {
    const proModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", // Thay đổi model không tồn tại thành model hỗ trợ
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 16,
        maxOutputTokens: 4096
      }
    });
    
    const simplePrompt = `Hãy tạo một hình ảnh minh họa đơn giản, dễ nhớ cho chữ Kanji: ${kanji}. 
    Hình ảnh nên thể hiện rõ ý nghĩa của Kanji và có hình dáng tương tự Kanji để dễ nhớ.
    Chỉ trả về hình ảnh base64 mà không có text nào khác.`;
    
    const proResult = await proModel.generateContent(simplePrompt);
    const proText = proResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const base64Match = proText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (base64Match) {
      console.log("Đã tạo hình ảnh thành công với model pro alternative");
      return new Response(
        JSON.stringify({
          imageData: base64Match[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh được tạo bằng phương pháp dự phòng."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (proError) {
    console.error("Lỗi khi thử với model pro alternative:", proError);
  }
  
  // Thử với model 1.5-flash - có khả năng tạo hình ảnh tốt
  try {
    const flashModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 32,
        maxOutputTokens: 2048
      }
    });
    
    const flashPrompt = `Tạo hình ảnh cho chữ Kanji: ${kanji}. Hãy trả về hình ảnh dưới dạng base64 image data.`;
    
    const flashResult = await flashModel.generateContent(flashPrompt);
    const flashText = flashResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const flashMatch = flashText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (flashMatch) {
      console.log("Đã tạo hình ảnh thành công với model flash");
      return new Response(
        JSON.stringify({
          imageData: flashMatch[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh được tạo bằng phương pháp dự phòng."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (flashError) {
    console.error("Lỗi khi thử với model flash:", flashError);
  }
  
  // Thử với model 2.0-flash nhưng prompt đơn giản hơn
  try {
    const stableModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.7,
        topK: 8,
        maxOutputTokens: 2048
      }
    });
    
    const minimalPrompt = `Tạo một hình ảnh đơn giản thể hiện chữ Kanji: ${kanji}`;
    
    const stableResult = await stableModel.generateContent(minimalPrompt);
    const stableText = stableResult.response.text();
    
    // Tìm dữ liệu base64 trong phản hồi
    const stableMatch = stableText.match(/data:image\/[^;]+;base64,[^"'\s]+/);
    if (stableMatch) {
      console.log("Đã tạo hình ảnh thành công với model 2.0-flash và prompt đơn giản");
      return new Response(
        JSON.stringify({
          imageData: stableMatch[0],
          recognizedKanji: kanji,
          generatedDescription: "Hình ảnh được tạo bằng phương pháp đơn giản hóa."
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (stableError) {
    console.error("Lỗi khi thử với model 2.0-flash đơn giản:", stableError);
  }
  
  // Nếu tất cả các phương pháp đều thất bại, trả về một hình ảnh đơn giản
  return createSimpleKanjiImage(kanji);
} 