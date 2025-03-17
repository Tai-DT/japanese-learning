import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserDataItem {
  [key: string]: string | number | undefined;
}

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

// Truy xuất dữ liệu học tập của người dùng từ Google Sheets
export async function GET(request: NextRequest) {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as User;

    // Lấy userId từ query string
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Kiểm tra xem userId trong request có khớp với userId trong session không
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized access to user data' }, { status: 403 });
    }

    const sheets = await initGoogleSheets();
    if (!sheets) {
      return NextResponse.json({ error: 'Failed to initialize Google Sheets' }, { status: 500 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'GOOGLE_SHEET_ID not defined' }, { status: 500 });
    }

    // Lấy dữ liệu học tập từ Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'UserStudyData!A:G', // Giả sử dữ liệu học tập được lưu trong sheet "UserStudyData"
    });

    const rows = response.data.values || [];
    
    // Nếu không có dữ liệu hoặc chỉ có header
    if (rows.length <= 1) {
      return NextResponse.json([], { status: 200 });
    }

    // Convert dữ liệu từ sheet sang JSON
    const headers = rows[0];
    const userDataRows = rows.slice(1).filter(row => row[0] === userId);
    
    const userData = userDataRows.map(row => {
      const item: UserDataItem = {};
      headers.forEach((header, index) => {
        if (header === 'score' || header === 'timeSpent') {
          item[header] = row[index] ? parseInt(row[index], 10) : undefined;
        } else {
          item[header] = row[index];
        }
      });
      return item;
    });

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface UserData {
  userId: string;
  date: string;
  category: string;
  topic: string;
  score?: number;
  timeSpent?: number;
  level?: string;
}

// Lưu dữ liệu học tập của người dùng vào Google Sheets
export async function POST(request: NextRequest) {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as User;

    const data = await request.json() as UserData;
    if (!data.userId || !data.category || !data.topic || !data.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Kiểm tra xem người dùng chỉ có thể lưu dữ liệu của chính họ
    if (user.id !== data.userId) {
      return NextResponse.json({ error: 'Unauthorized access to user data' }, { status: 403 });
    }

    const sheets = await initGoogleSheets();
    if (!sheets) {
      return NextResponse.json({ error: 'Failed to initialize Google Sheets' }, { status: 500 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'GOOGLE_SHEET_ID not defined' }, { status: 500 });
    }

    // Lưu dữ liệu học tập vào Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'UserStudyData!A:G',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          data.userId,
          data.date || new Date().toISOString(),
          data.category,
          data.topic,
          data.score || '',
          data.timeSpent || '',
          data.level || ''
        ]]
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 