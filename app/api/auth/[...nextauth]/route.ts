import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { google } from "googleapis";

// Khởi tạo Google Sheets API
const initGoogleSheets = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    return sheets;
  } catch (error) {
    console.error('Lỗi khởi tạo Google Sheets:', error);
    return null;
  }
};

// Lưu dữ liệu người dùng vào Google Sheet
const saveUserToSheet = async (user: any) => {
  try {
    const sheets = await initGoogleSheets();
    if (!sheets) return;

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      console.error('GOOGLE_SHEET_ID không được định nghĩa');
      return;
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:A',
    });

    const existingUsers = userExists.data.values || [];
    const userIds = existingUsers.map((row: any) => row[0]);
    
    if (userIds.includes(user.id)) {
      // Cập nhật thông tin người dùng nếu đã tồn tại
      const rowIndex = userIds.indexOf(user.id) + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Users!A${rowIndex}:E${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            user.id, 
            user.name,
            user.email,
            user.image,
            new Date().toISOString()
          ]]
        }
      });
    } else {
      // Thêm người dùng mới
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Users!A:E',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[
            user.id, 
            user.name,
            user.email,
            user.image,
            new Date().toISOString()
          ]]
        }
      });
    }
  } catch (error) {
    console.error('Lỗi khi lưu người dùng vào Google Sheet:', error);
  }
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (user) {
          await saveUserToSheet(user);
        }
        return true;
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return true; // Vẫn cho phép đăng nhập ngay cả khi lưu thất bại
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 