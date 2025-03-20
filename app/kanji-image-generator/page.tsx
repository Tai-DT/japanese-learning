"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { GoogleAIFileManager } from "@/lib/google-ai-file-manager";

interface KanjiResult {
  imageData: string;
  recognizedKanji: string;
  generatedDescription: string;
}

export default function KanjiImageGenerator() {
  const [kanji, setKanji] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KanjiResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi người dùng chọn file hình ảnh
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        // Tối ưu hình ảnh trước khi hiển thị
        const optimizedFile = await GoogleAIFileManager.optimizeImage(file);
        setImage(optimizedFile);
        
        // Tạo URL xem trước cho hình ảnh đã tối ưu
        const objectUrl = URL.createObjectURL(optimizedFile);
        setPreviewUrl(objectUrl);
      } catch (err) {
        console.error("Lỗi khi tối ưu hình ảnh:", err);
        // Nếu có lỗi, sử dụng file gốc
        setImage(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
    }
  };

  // Xử lý khi người dùng nhấn nút tải lên hình ảnh
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý khi người dùng xóa hình ảnh đã chọn
  const handleClearImage = () => {
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý khi form được gửi đi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!kanji && !image) {
      setError("Vui lòng nhập Kanji hoặc tải lên hình ảnh");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Tạo formData để gửi dữ liệu
      const formData = new FormData();
      if (kanji) formData.append("kanji", kanji);
      if (prompt) formData.append("prompt", prompt);
      if (image) formData.append("image", image);
      
      // Gửi request đến API
      const response = await fetch("/api/ai/kanji-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi xử lý yêu cầu");
      }
      
      const data = await response.json();
      setResult(data);
      
      // Nếu Kanji được nhận dạng từ hình ảnh, cập nhật trường nhập Kanji
      if (data.recognizedKanji && !kanji) {
        setKanji(data.recognizedKanji);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo hình ảnh Kanji");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tải xuống hình ảnh
  const handleDownloadImage = () => {
    if (!result?.imageData) return;
    
    try {
      // Tạo blob từ dữ liệu base64
      const blob = GoogleAIFileManager.base64ToBlob(
        result.imageData, 
        result.imageData.split(';')[0].split(':')[1] || 'image/png'
      );
      
      // Tạo URL từ blob
      const url = URL.createObjectURL(blob);
      
      // Tạo thẻ a và thiết lập thuộc tính để tải xuống
      const link = document.createElement("a");
      link.href = url;
      link.download = `kanji-${result.recognizedKanji || "image"}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Lỗi khi tải xuống hình ảnh:", err);
      // Phương pháp dự phòng nếu cách trên không hoạt động
      const link = document.createElement("a");
      link.href = result.imageData;
      link.download = `kanji-${result.recognizedKanji || "image"}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tạo Hình Ảnh Minh Họa Kanji</h1>
      
      <Tabs defaultValue="text" className="w-full max-w-3xl mx-auto mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Nhập Kanji</TabsTrigger>
          <TabsTrigger value="image">Tải lên hình ảnh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Nhập ký tự Kanji</CardTitle>
              <CardDescription>
                Nhập ký tự Kanji để tạo hình ảnh minh họa
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kanji">Kanji</Label>
                  <Input
                    id="kanji"
                    value={kanji}
                    onChange={(e) => setKanji(e.target.value)}
                    placeholder="Nhập ký tự Kanji ở đây"
                    className="text-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt">Mô tả chi tiết (tùy chọn)</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Mô tả chi tiết về hình ảnh minh họa bạn muốn (ví dụ: phong cách, màu sắc, đối tượng,...)"
                    className="h-24"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Đang tạo..." : "Tạo hình ảnh minh họa"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên hình ảnh có chứa Kanji</CardTitle>
              <CardDescription>
                Tải lên hình ảnh có chứa ký tự Kanji để nhận dạng và tạo hình minh họa
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    title="Tải lên hình ảnh Kanji"
                  />
                  
                  {previewUrl ? (
                    <div className="space-y-4 w-full">
                      <div className="relative w-full h-48 mx-auto">
                        <Image 
                          src={previewUrl} 
                          alt="Preview" 
                          fill 
                          style={{ objectFit: "contain" }} 
                        />
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button type="button" onClick={handleClearImage} variant="outline">
                          Xóa hình ảnh
                        </Button>
                        <Button type="button" onClick={handleImageUploadClick} variant="outline">
                          Chọn hình khác
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Button type="button" onClick={handleImageUploadClick}>
                        Chọn hình ảnh
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG hoặc GIF (tối đa 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagePrompt">Mô tả chi tiết (tùy chọn)</Label>
                  <Textarea
                    id="imagePrompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Mô tả chi tiết về hình ảnh minh họa bạn muốn"
                    className="h-24"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading || !image} className="w-full">
                  {loading ? "Đang xử lý..." : "Xử lý hình ảnh"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 max-w-3xl mx-auto">
          {error}
        </div>
      )}

      {result?.imageData && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Hình ảnh minh họa cho Kanji: {result.recognizedKanji}</CardTitle>
            <CardDescription>
              Được tạo dựa trên mô tả của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full max-w-xl mb-6">
              <img
                src={result.imageData}
                alt={`Minh họa cho Kanji ${result.recognizedKanji}`}
                className="w-full h-auto object-contain rounded-md shadow-md"
              />
            </div>
            
            <div className="w-full space-y-2">
              <h3 className="text-lg font-semibold">Kanji được nhận dạng:</h3>
              <div className="bg-gray-50 p-4 rounded-md text-center text-4xl">
                {result.recognizedKanji}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleDownloadImage} variant="outline" className="mr-2">
              Tải xuống hình ảnh
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 