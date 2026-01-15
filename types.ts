
export interface Book {
  id: string;
  author: string;
  title: string;
  bookCategory: string; // Turi (Badiiy, Darslik va h.k.)
  isbn: string; // ISBN kodi (endilikda majburiy)
  pages: number; // Beti
  department: string; // Bo'limi
  titlesCount: number; // Nomda
  copiesCount: number; // Nusxada
  pricePerCopy: number; // Summasi (dona)
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
