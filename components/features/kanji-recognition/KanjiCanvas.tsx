// components/features/kanji-recognition/KanjiCanvas.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { KanjiItem } from "@/types";
import Link from "next/link";

interface KanjiCanvasProps {
  onRecognizeKanji: (kanjiData: KanjiItem | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Define stroke type for better type safety
interface StrokePoint {
  x: number;
  y: number;
}

interface Stroke {
  points: StrokePoint[];
}

export default function KanjiCanvas({ 
  onRecognizeKanji,
  isLoading,
  setIsLoading
}: KanjiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPoint, setLastPoint] = useState<StrokePoint | null>(null);
  
  // Fix: Correct type definition for strokes
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([]);
  
  const [hasDrawing, setHasDrawing] = useState(false);
  
  // State để theo dõi nếu có API key được cấu hình
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  // Kiểm tra và theo dõi sự thay đổi của API key trong localStorage
  useEffect(() => {
    // Kiểm tra ban đầu
    const checkApiKey = () => {
      const savedApiKey = localStorage.getItem('google_ai_api_key');
      setHasApiKey(!!savedApiKey);
    };
    
    // Kiểm tra ngay lập tức
    checkApiKey();
    
    // Tạo một event listener để phát hiện thay đổi từ các tab/window khác
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'google_ai_api_key') {
        checkApiKey();
      }
    };
    
    // Thêm event listener cho storage
    window.addEventListener('storage', handleStorageChange);
    
    // Kiểm tra định kỳ mỗi 5 giây để đảm bảo đồng bộ
    const intervalId = setInterval(checkApiKey, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  // Function to redraw all strokes (used after resizing)
  const redrawCanvas = useCallback((context: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = context.canvas;
    
    context.clearRect(0, 0, canvas.width/dpr, canvas.height/dpr);
    
    // Draw all completed strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        
        // Use quadratic curves for smoother lines
        const midPoint = {
          x: (p0.x + p1.x) / 2,
          y: (p0.y + p1.y) / 2
        };
        
        context.quadraticCurveTo(p0.x, p0.y, midPoint.x, midPoint.y);
      }
      
      context.stroke();
    });
  }, [strokes]);

  // Setup canvas with proper scaling and clean rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle canvas scaling for better drawing precision
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Thiết lập kích thước canvas với devicePixelRatio để vẽ rõ nét hơn
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Thiết lập style để hiển thị đúng kích thước
      canvas.style.width = `${rect.width}px`; 
      canvas.style.height = `${rect.height}px`;
      
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        // Áp dụng scale theo devicePixelRatio
        context.scale(dpr, dpr);
        
        // Thiết lập nét vẽ đậm và rõ hơn
        context.lineWidth = 12; // Tăng độ đậm của nét vẽ
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "black";
        setCtx(context);
        
        // Redraw existing strokes after resize
        redrawCanvas(context);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [strokes, redrawCanvas]);

  // Get correct coordinates relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    // Không áp dụng scale ở đây, vì đã xử lý bằng context.scale()
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start a new stroke when the user begins drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    e.preventDefault();
    
    // Bắt giữ pointer để tránh mất sự kiện khi vẽ nhanh
    if (canvasRef.current) {
      canvasRef.current.setPointerCapture(e.pointerId);
    }
    
    setIsDrawing(true);
    
    const point = getCoordinates(e);
    setLastPoint(point);
    
    // Start tracking the current stroke
    setCurrentStroke([point]);
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  // Update the stroke as the user continues drawing
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !lastPoint) return;
    
    e.preventDefault();
    const currentPoint = getCoordinates(e);
    
    // Kiểm tra khoảng cách quá nhỏ để tránh quá nhiều điểm
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - lastPoint.x, 2) + 
      Math.pow(currentPoint.y - lastPoint.y, 2)
    );
    
    // Bỏ qua các điểm quá gần nhau
    if (distance < 2) return;
    
    // Update current stroke data
    setCurrentStroke(prev => [...prev, currentPoint]);
    setHasDrawing(true);
    
    // Draw with smoothing
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    
    // Smoothing curve for more natural writing
    const midPoint = {
      x: (lastPoint.x + currentPoint.x) / 2,
      y: (lastPoint.y + currentPoint.y) / 2
    };
    
    ctx.quadraticCurveTo(
      lastPoint.x, 
      lastPoint.y, 
      midPoint.x, 
      midPoint.y
    );
    
    ctx.stroke();
    setLastPoint(currentPoint);
  };

  // Complete the stroke but don't trigger automatic recognition
  const endDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !lastPoint) return;
    
    e.preventDefault();
    
    // Giải phóng pointer capture
    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Complete the final line segment
    const currentPoint = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    // Save the completed stroke
    setStrokes(prev => [...prev, { points: [...currentStroke, currentPoint] }]);
    setCurrentStroke([]);
    
    setIsDrawing(false);
    setLastPoint(null);
  };

  // Xử lý sự kiện khi pointer rời khỏi khu vực canvas nhưng người dùng vẫn đang vẽ
  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Chỉ xử lý khi đang vẽ
    if (isDrawing && ctx && lastPoint) {
      // Ghi nhận nét vẽ hiện tại
      setStrokes(prev => [...prev, { points: [...currentStroke] }]);
      setCurrentStroke([]);
      setIsDrawing(false);
      setLastPoint(null);
      
      // Giải phóng pointer capture
      if (canvasRef.current) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
    }
  };

  // Clear the canvas and reset all state
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(
      0, 
      0, 
      canvasRef.current.width/dpr, 
      canvasRef.current.height/dpr
    );
    
    setStrokes([]);
    setCurrentStroke([]);
    setHasDrawing(false);
    onRecognizeKanji(null);
    setError(null);
  };

  // Manual recognition when clicking the button
  const recognizeKanji = async () => {
    if (!canvasRef.current || !hasDrawing) {
      setError("Vui lòng vẽ một chữ Kanji trước khi nhận dạng");
      return;
    }
    
    // Lấy API key mới nhất từ localStorage
    const savedApiKey = localStorage.getItem('google_ai_api_key');
    const currentHasApiKey = !!savedApiKey;
    
    // Chuẩn bị canvas cho nhận dạng tốt hơn
    const tempCanvas = document.createElement('canvas');
    const size = 800; // Tăng kích thước lên 800px để chi tiết hơn
    
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!tempCtx) {
      setError("Không thể tạo canvas tạm thời");
      return;
    }
    
    // Vẽ nền trắng
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, size, size);
    
    // Tính toán tọa độ của tất cả các nét vẽ để xác định vùng vẽ
    let allPoints: StrokePoint[] = [];
    strokes.forEach(stroke => {
      allPoints = [...allPoints, ...stroke.points];
    });
    
    if (allPoints.length === 0) {
      setError("Không có đủ dữ liệu nét vẽ");
      return;
    }
    
    // Tìm tọa độ giới hạn của nét vẽ
    const minX = Math.min(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const maxY = Math.max(...allPoints.map(p => p.y));
    
    // Tính toán kích thước và vị trí trung tâm
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    
    // Để tránh các nét vẽ quá nhỏ hoặc quá lớn, tính toán tỷ lệ phù hợp
    const maxDimension = Math.max(width, height);
    // Sử dụng 70% không gian canvas để kanji không bị quá nhỏ hoặc quá lớn
    const targetSize = size * 0.7;
    let scaleFactor = targetSize / maxDimension;
    
    // Giới hạn tỷ lệ tối thiểu và tối đa
    if (scaleFactor < 1) scaleFactor = 1;
    if (scaleFactor > 10) scaleFactor = 10;
    
    // Cấu hình vẽ cho nét đậm, rõ ràng
    tempCtx.lineWidth = 26; // Tăng độ đậm hơn nữa
    tempCtx.lineCap = "round";
    tempCtx.lineJoin = "round";
    tempCtx.strokeStyle = "black";
    
    // Vẽ lại từng nét với tỷ lệ và căn giữa
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      
      tempCtx.beginPath();
      
      // Vẽ từng nét với tỷ lệ mới và căn giữa
      const canvasCenterX = size / 2;
      const canvasCenterY = size / 2;
      
      const startX = (stroke.points[0].x - centerX) * scaleFactor + canvasCenterX;
      const startY = (stroke.points[0].y - centerY) * scaleFactor + canvasCenterY;
      
      tempCtx.moveTo(startX, startY);
      
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        
        const x0 = (p0.x - centerX) * scaleFactor + canvasCenterX;
        const y0 = (p0.y - centerY) * scaleFactor + canvasCenterY;
        const x1 = (p1.x - centerX) * scaleFactor + canvasCenterX;
        const y1 = (p1.y - centerY) * scaleFactor + canvasCenterY;
        
        // Sử dụng đường cong Bezier cho nét mượt
        if (i === 1) {
          // Nét đầu tiên dùng đường thẳng
          tempCtx.lineTo(x1, y1);
        } else {
          // Các nét tiếp theo dùng đường cong
          const midX = (x0 + x1) / 2;
          const midY = (y0 + y1) / 2;
          tempCtx.quadraticCurveTo(x0, y0, midX, midY);
        }
      }
      
      // Vẽ nét cuối
      const lastPoint = stroke.points[stroke.points.length - 1];
      const lastX = (lastPoint.x - centerX) * scaleFactor + canvasCenterX;
      const lastY = (lastPoint.y - centerY) * scaleFactor + canvasCenterY;
      tempCtx.lineTo(lastX, lastY);
      
      tempCtx.stroke();
    });
    
    // Thêm bước xử lý hình ảnh để làm rõ nét vẽ
    enhanceImage(tempCtx, size);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Lấy dữ liệu từ canvas tạm thời với chất lượng cao
      const imageData = tempCanvas.toDataURL('image/png', 1.0);
      
      console.log("Image data length:", imageData.length);
      
      // Sử dụng API phù hợp dựa vào lựa chọn của người dùng
      const apiEndpoint = currentHasApiKey ? '/api/ai/recognize-kanji-client' : '/api/ai/recognize-kanji';
      
      const requestBody = currentHasApiKey 
        ? { image: imageData, apiKey: savedApiKey } 
        : { image: imageData };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Xử lý lỗi API key
        if (currentHasApiKey && response.status === 401) {
          setError("API key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại key tại trang chủ.");
          throw new Error('API key không hợp lệ');
        }
        
        if (response.status === 500 && data.error?.includes('deprecated')) {
          throw new Error('AI model has been deprecated. Please contact admin for an update.');
        }
        throw new Error(data.error || 'Failed to recognize kanji');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Recognition failed');
      }
      
      if (!data.kanji || !data.kanji.character) {
        throw new Error('Invalid response format from server');
      }
      
      onRecognizeKanji(data.kanji);
    } catch (error: unknown) {
      console.error('Error recognizing kanji:', error);
      if (error instanceof Error) {
        if (error.message?.includes('deprecated')) {
          setError("Hệ thống AI đã lỗi thời. Vui lòng liên hệ quản trị viên để cập nhật.");
        } else if (error.message?.includes('Invalid image format')) {
          setError("Định dạng ảnh không hợp lệ. Vui lòng thử vẽ lại.");
        } else if (error.message?.includes('Invalid response format')) {
          setError("Lỗi định dạng dữ liệu từ máy chủ. Vui lòng thử lại.");
        } else if (error.message?.includes('API key không hợp lệ')) {
          // Lỗi đã được xử lý ở trên
        } else {
          setError(`Không thể nhận dạng Kanji: ${error.message || 'Đã xảy ra lỗi'}. Vui lòng thử lại.`);
        }
      } else {
        setError("Không thể nhận dạng Kanji: Đã xảy ra lỗi. Vui lòng thử lại.");
      }
      onRecognizeKanji(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hàm xử lý hình ảnh để làm rõ nét vẽ
  const enhanceImage = (ctx: CanvasRenderingContext2D, size: number) => {
    try {
      // Lấy dữ liệu hình ảnh
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      
      // Xử lý tăng độ tương phản
      for (let i = 0; i < data.length; i += 4) {
        // Nếu pixel gần đen (nét vẽ), làm cho nó hoàn toàn đen
        if (data[i] < 128) {
          data[i] = 0;      // R
          data[i + 1] = 0;  // G
          data[i + 2] = 0;  // B
        } 
        // Nếu pixel gần trắng (nền), làm cho nó hoàn toàn trắng
        else {
          data[i] = 255;    // R
          data[i + 1] = 255;// G
          data[i + 2] = 255;// B
        }
        // Giữ nguyên kênh alpha
        data[i + 3] = data[i + 3];
      }
      
      // Cập nhật lại hình ảnh
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error("Error enhancing image:", error);
      // Tiếp tục mà không có xử lý nâng cao
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="bg-white w-full h-[400px] touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={handlePointerLeave}
          style={{ touchAction: "none" }} // Prevent scrolling on touch
        />
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={clearCanvas} 
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Xóa
        </button>
        <button 
          onClick={recognizeKanji} 
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Đang nhận dạng..." : "Nhận dạng Kanji"}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          <p className="font-medium mb-1">Lỗi:</p>
          <p>{error}</p>
          {typeof error === 'string' && error.includes('AI đã lỗi thời') && (
            <p className="mt-1 text-xs">
              Chi tiết kỹ thuật: Gemini 1.0 Pro Vision đã ngừng hoạt động từ 12/7/2024. 
              Cần cập nhật lên gemini-2.0-flash.
            </p>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p className="font-medium">Hướng dẫn vẽ Kanji tốt nhất:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Vẽ to, rõ ràng và đầy đủ nét</li>
          <li>Vẽ chính giữa canvas</li>
          <li>Vẽ đầy đủ số nét của chữ Kanji</li>
          <li>Tránh vẽ quá nhỏ hoặc quá nhanh</li>
          <li>Vẽ theo thứ tự nét chuẩn của Kanji</li>
          <li><strong>Sau khi vẽ xong, nhấn nút &quot;Nhận dạng Kanji&quot;</strong></li>
        </ul>
      </div>
      
      <div className="text-center mt-2">
        <button
          onClick={() => {
            if (canvasRef.current) {
              // Vẽ ví dụ mẫu kanji đơn giản
              clearCanvas();
              // Để phòng khi clearCanvas chưa xong, chờ một tick
              setTimeout(() => {
                const ctx = canvasRef.current?.getContext('2d');
                if (ctx) {
                  // Vẽ kanji 日 (nhật) như một ví dụ
                  const centerX = (canvasRef.current?.width || 0) / 2;
                  const centerY = (canvasRef.current?.height || 0) / 2;
                  const size = 100;
                  
                  // Vẽ hình vuông ngoài
                  ctx.beginPath();
                  ctx.moveTo(centerX - size, centerY - size);
                  ctx.lineTo(centerX + size, centerY - size);
                  ctx.lineTo(centerX + size, centerY + size);
                  ctx.lineTo(centerX - size, centerY + size);
                  ctx.lineTo(centerX - size, centerY - size);
                  ctx.stroke();
                  
                  // Vẽ đường ngang ở giữa
                  ctx.beginPath();
                  ctx.moveTo(centerX - size, centerY);
                  ctx.lineTo(centerX + size, centerY);
                  ctx.stroke();
                  
                  // Vẽ đường dọc ở giữa
                  ctx.beginPath();
                  ctx.moveTo(centerX, centerY - size);
                  ctx.lineTo(centerX, centerY + size);
                  ctx.stroke();
                  
                  setHasDrawing(true);
                  setStrokes([
                    {
                      points: [
                        {x: centerX - size, y: centerY - size},
                        {x: centerX + size, y: centerY - size},
                        {x: centerX + size, y: centerY + size},
                        {x: centerX - size, y: centerY + size},
                        {x: centerX - size, y: centerY - size}
                      ]
                    },
                    {
                      points: [
                        {x: centerX - size, y: centerY},
                        {x: centerX + size, y: centerY}
                      ]
                    },
                    {
                      points: [
                        {x: centerX, y: centerY - size},
                        {x: centerX, y: centerY + size}
                      ]
                    }
                  ]);
                }
              }, 100);
            }
          }}
          className="text-sm text-blue-600 underline"
        >
          Vẽ kanji mẫu để thử nghiệm
        </button>
      </div>
      
      {/* Hiển thị trạng thái của API key */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100">
          <span className={`w-2 h-2 rounded-full mr-2 ${hasApiKey ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span>
            {hasApiKey 
              ? "Đang sử dụng API key riêng từ trang chủ" 
              : "Đang sử dụng API key hệ thống"}
          </span>
        </div>
        {hasApiKey && (
          <p className="text-xs text-gray-500 mt-1">
            Thay đổi API key tại trang chủ
          </p>
        )}
        {!hasApiKey && (
          <p className="text-xs text-gray-500 mt-1">
            Để tránh tình trạng quá tải API, bạn có thể thiết lập API key riêng tại <Link href="/" className="text-blue-600 underline">trang chủ</Link>
          </p>
        )}
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-2 text-sm text-blue-600">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích nét vẽ...
        </div>
      )}
    </div>
  );
}
