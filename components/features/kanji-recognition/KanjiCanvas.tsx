// components/features/kanji-recognition/KanjiCanvas.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { KanjiItem } from "@/types";

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
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup canvas with proper scaling and clean rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle canvas scaling for better drawing precision
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        context.lineWidth = 8;
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
  }, [strokes]);

  // Function to redraw all strokes (used after resizing)
  const redrawCanvas = useCallback((context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
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

  // Get correct coordinates relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Start a new stroke when the user begins drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    e.preventDefault();
    setIsDrawing(true);
    
    const point = getCoordinates(e);
    setLastPoint(point);
    
    // Start tracking the current stroke
    setCurrentStroke([point]);
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    
    // Cancel any pending recognition
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
  };

  // Update the stroke as the user continues drawing
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !lastPoint) return;
    
    e.preventDefault();
    const currentPoint = getCoordinates(e);
    
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

  // Complete the stroke and trigger real-time recognition
  const endDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !lastPoint) return;
    
    e.preventDefault();
    
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
    
    // Trigger real-time recognition with debouncing (800ms delay)
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
    
    recognitionTimeoutRef.current = setTimeout(() => {
      // Only recognize if we have some drawing
      if (hasDrawing) {
        recognizeKanjiRealTime();
      }
    }, 800);
  };

  // Clear the canvas and reset all state
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(
      0, 
      0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    setStrokes([]);
    setCurrentStroke([]);
    setHasDrawing(false);
    onRecognizeKanji(null);
    setError(null);
    
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
  };

  // Automatic recognition after stroke completion
  const recognizeKanjiRealTime = async () => {
    if (!canvasRef.current || isLoading || !hasDrawing) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png', 1.0);
      
      // Send to API for recognition
      const response = await fetch('/api/ai/recognize-kanji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to recognize kanji');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Recognition failed');
      }
      
      onRecognizeKanji(data.kanji);
    } catch (error: unknown) {
      console.error('Error in real-time kanji recognition:', error);
      if (error instanceof Error) {
        setError(`Không thể nhận dạng tự động: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manual recognition when clicking the button
  const recognizeKanji = async () => {
    if (!canvasRef.current || !hasDrawing) {
      setError("Vui lòng vẽ một chữ Kanji trước khi nhận dạng");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png', 1.0);
      
      console.log("Image data length:", imageData.length);
      
      const response = await fetch('/api/ai/recognize-kanji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 500 && data.error?.includes('deprecated')) {
          throw new Error('AI model has been deprecated. Please contact admin for an update.');
        }
        throw new Error(data.error || 'Failed to recognize kanji');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Recognition failed');
      }
      
      onRecognizeKanji(data.kanji);
    } catch (error: unknown) {
      console.error('Error recognizing kanji:', error);
      if (error instanceof Error) {
        if (error.message?.includes('deprecated')) {
          setError("Hệ thống AI đã lỗi thời. Vui lòng liên hệ quản trị viên để cập nhật.");
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

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="bg-white w-full h-[400px] touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerOut={endDrawing}
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
              Cần cập nhật lên gemini-1.5-flash.
            </p>
          )}
        </div>
      )}
      
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
