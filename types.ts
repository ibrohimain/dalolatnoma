
export interface Book {
  id: string;
  author: string;
  title: string;
  bookCategory: string; // Manually entered type (e.g., 'Badiiy adabiyot', 'Darslik')
  isbn?: string; 
  pages: number; // New field: Beti
  department: string; // Bo'limi
  titlesCount: number; // Nomda
  copiesCount: number; // Nusxada
  pricePerCopy: number; // Summasi
  totalSum: number; // Jami summasi
}

export type ActStatus = 'yangi' | 'tasdiqlangan';
export type UserType = 'ichki' | 'tashqi';

export interface Dalolatnoma {
  id: string;
  actNumber: string;
  date: string; 
  printDate: string; 
  receiverEmployees: string; 
  giverFaculty: string; 
  giverTitle: string; 
  giverName: string; 
  userType: UserType;
  status: ActStatus;
  actDescription: string; 
  books: Book[];
  createdAt: number;
}
