import { FileData, Part } from "@google/generative-ai";

/**
 * Class quản lý việc xử lý file cho Google Gemini API
 */
export class GoogleAIFileManager {
  /**
   * Chuyển đổi File sang đối tượng FileData cho Google Gemini API
   * @param file File từ HTML input
   * @returns Promise<FileData>
   */
  static async fileToGenerativeFileData(file: File): Promise<FileData> {
    const data = await this.fileToBase64(file);
    return {
      data,
      mimeType: file.type,
    };
  }

  /**
   * Chuyển đổi File thành Part cho Google Gemini API
   * @param file File từ HTML input
   * @returns Promise<Part>
   */
  static async fileToPart(file: File): Promise<Part> {
    const base64 = await this.fileToBase64(file);
    const base64Data = base64.split(',')[1]; // Lấy phần dữ liệu sau data:image/...;base64,
    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };
  }

  /**
   * Chuyển đổi base64 thành blob để download
   * @param base64Data Chuỗi dữ liệu base64
   * @param mimeType Loại MIME
   * @returns Blob
   */
  static base64ToBlob(base64Data: string, mimeType = 'image/png'): Blob {
    // Xử lý dữ liệu base64 nếu có định dạng data URL
    const base64WithoutPrefix = base64Data.includes('data:') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    const byteCharacters = atob(base64WithoutPrefix);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  }

  /**
   * Tạo URL cho việc download hình ảnh
   * @param base64Data Chuỗi dữ liệu base64
   * @param mimeType Loại MIME
   * @returns String URL
   */
  static createDownloadUrl(base64Data: string, mimeType = 'image/png'): string {
    // Kiểm tra nếu đã là data URL thì trả về luôn
    if (base64Data.startsWith('data:')) {
      return base64Data;
    }

    // Tạo data URL từ base64
    return `data:${mimeType};base64,${base64Data}`;
  }

  /**
   * Chuyển đổi File thành chuỗi base64
   * @param file File từ HTML input
   * @returns Promise<string>
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result as string;
        // Trả về chuỗi base64 đầy đủ với data URL prefix
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Tối ưu kích thước ảnh trước khi gửi đến API
   * @param file File hình ảnh
   * @param maxWidth Chiều rộng tối đa
   * @param maxHeight Chiều cao tối đa
   * @param quality Chất lượng ảnh (0-1)
   * @returns Promise<File>
   */
  static async optimizeImage(
    file: File, 
    maxWidth = 800, 
    maxHeight = 800, 
    quality = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      // Tạo một đối tượng Image để đọc file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        // Tính toán kích thước mới giữ tỷ lệ
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Tạo canvas để vẽ ảnh đã resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không thể tạo context cho canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Chuyển đổi canvas thành blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Không thể tạo blob từ canvas'));
            return;
          }
          
          // Tạo file mới từ blob
          const optimizedFile = new File(
            [blob], 
            file.name, 
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          
          // Giải phóng URL object
          URL.revokeObjectURL(img.src);
          
          resolve(optimizedFile);
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Lỗi khi tải hình ảnh'));
      };
    });
  }
} 