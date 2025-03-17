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
- [React Context API](https://reactjs.org/docs/context.html) - Quản lý trạng thái người dùng

## Thiết lập dự án

### Yêu cầu

- Node.js 18.x trở lên
- npm hoặc yarn

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

3. Chạy dự án trong môi trường phát triển:

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập ứng dụng tại `http://localhost:3000`

## Cấu trúc thư mục

```
japanese-learning/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── auth/               # Trang xác thực
│   ├── lessons/            # Trang bài học
│   ├── practice/           # Trang luyện tập
│   ├── profile/            # Trang hồ sơ người dùng
│   └── ...
├── components/             # React Components
│   ├── auth/               # Components xác thực
│   ├── features/           # Components tính năng
│   └── layout/             # Components layout
├── lib/                    # Tiện ích
├── public/                 # Tài nguyên tĩnh
└── ...
```

## Lưu trữ dữ liệu

Dữ liệu người dùng (bao gồm tiến độ học tập) được lưu trữ cục bộ trong localStorage của trình duyệt. Trong môi trường sản xuất thực tế, bạn có thể muốn thay thế bằng một cơ sở dữ liệu thực sự.

## Đóng góp

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình gửi pull request.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.
