# Ứng Dụng Học Tiếng Nhật với AI

Ứng dụng học tiếng Nhật thông minh sử dụng AI, cho phép người dùng học từ vựng, luyện tập kanji, và cải thiện kỹ năng ngôn ngữ với trải nghiệm được cá nhân hóa.

## Tính năng

- 📚 **Học từ vựng** - Học từ vựng tiếng Nhật với phát âm và ví dụ
- 📖 **Bài học có cấu trúc** - Nội dung học theo trình độ JLPT từ N5 đến N1
- 🏋️‍♂️ **Luyện tập đa dạng** - Nhiều loại bài tập cho từng kỹ năng
- ✍️ **Luyện Kanji** - Nhận dạng và học cách viết Kanji
- 📝 **Ngữ pháp** - Bài tập ngữ pháp tạo tự động bởi AI
- 💬 **Hội thoại** - Luyện tập hội thoại với AI

## Công nghệ sử dụng

- [Next.js 14](https://nextjs.org/) - Framework React với App Router
- [TypeScript](https://www.typescriptlang.org/) - JavaScript với kiểu dữ liệu
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Xác thực và phân quyền
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - Đăng nhập với Google
- [Google Sheets API](https://developers.google.com/sheets/api) - Lưu trữ dữ liệu người dùng

## Thiết lập dự án

### Yêu cầu

- Node.js 18.x trở lên
- npm hoặc yarn
- Tài khoản Google để thiết lập OAuth và Google Sheets API

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/yourusername/japanese-learning.git
cd japanese-learning
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Sao chép file môi trường:

```bash
cp .env.local.example .env.local
```

4. Cấu hình các biến môi trường trong `.env.local`:

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Google Sheets
GOOGLE_SHEET_ID=your-google-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@example.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

5. Chạy dự án trong môi trường phát triển:

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập ứng dụng tại `http://localhost:3000`

## Thiết lập Google OAuth và Google Sheets API

### 1. Tạo Project trong Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Đặt tên project (ví dụ: "Japanese Learning App")

### 2. Cấu hình OAuth 2.0

1. Trong project mới tạo, mở menu và chọn "APIs & Services" > "Credentials"
2. Nhấn "Create Credentials" và chọn "OAuth client ID"
3. Cấu hình màn hình đồng ý OAuth:
   - Chọn "External" và nhấn "Create"
   - Điền thông tin app name, user support email, và developer contact email
   - Nhấn "Save and Continue"
4. Thêm các scopes: `userinfo.email`, `userinfo.profile`, và `openid`
5. Quay lại "Credentials" và tạo OAuth client ID:
   - Application type: Web application
   - Name: Japanese Learning App
   - Authorized JavaScript origins: `http://localhost:3000` (thêm domain thực tế khi triển khai)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (thêm URI tương ứng cho domain thực tế)
6. Nhấn "Create" và lưu lại Client ID và Client Secret

### 3. Thiết lập Google Sheets API

1. Trong Google Cloud Console, mở "APIs & Services" > "Library"
2. Tìm kiếm "Google Sheets API" và kích hoạt
3. Tạo Service Account:
   - Trong "APIs & Services" > "Credentials", nhấn "Create Credentials" > "Service Account"
   - Điền tên và mô tả cho service account, nhấn "Create"
   - Cấp quyền "Editor" cho service account, nhấn "Continue"
   - Nhấn "Done"
4. Tạo key cho Service Account:
   - Trong danh sách Service Accounts, click vào service account vừa tạo
   - Chọn tab "Keys" > "Add Key" > "Create new key"
   - Chọn JSON format và nhấn "Create"
   - Một file JSON sẽ được tải về, lưu giữ an toàn

### 4. Tạo Google Sheet để lưu dữ liệu

1. Truy cập [Google Sheets](https://sheets.google.com/) và tạo sheet mới
2. Tạo 2 sheets:
   - Sheet 1: "Users" với các cột: userId, name, email, image, lastLogin
   - Sheet 2: "UserStudyData" với các cột: userId, date, category, topic, score, timeSpent, level
3. Chia sẻ sheet với service account email (có dạng `something@project-id.iam.gserviceaccount.com`)
4. Sao chép Spreadsheet ID từ URL (phần giữa `/d/` và `/edit` trong URL)

### 5. Cập nhật biến môi trường

Cập nhật file `.env.local` với thông tin đã lấy được:

```
GOOGLE_CLIENT_ID=<OAuth Client ID>
GOOGLE_CLIENT_SECRET=<OAuth Client Secret>
GOOGLE_SHEET_ID=<Spreadsheet ID>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<Service Account Email>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Lưu ý: Sao chép toàn bộ private key từ file JSON đã tải về, thay thế các dấu xuống dòng bằng `\n`

## Đóng góp

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình gửi pull request.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.
