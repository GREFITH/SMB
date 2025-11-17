
import { User } from "@/store/auth-store";

// Mock user data
const MOCK_USERS = [
  { id: '1', username: 'user', password: 'password', role: 'user' },
  { id: '2', username: 'admin', password: 'admin123', role: 'admin' }
];

// Mock media data
export type MediaType = {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  startDate: Date;
  endDate: Date;
  displayDuration: number;
  url: string;
  screenNumber?: number; // Added screenNumber property
};

let MOCK_MEDIA: MediaType[] = [
  {
    id: '1',
    userId: '1',
    filename: 'sample-image.jpg',
    fileType: 'image/jpeg',
    fileSize: 1024 * 1024 * 2, // 2MB
    uploadDate: new Date('2025-04-01'),
    startDate: new Date('2025-04-01'),
    endDate: new Date('2026-04-01'),
    displayDuration: 10,
    url: 'https://source.unsplash.com/random/800x600/?nature',
    screenNumber: 1 // Added screen number
  },
  {
    id: '2',
    userId: '1',
    filename: 'sample-video.mp4',
    fileType: 'video/mp4',
    fileSize: 1024 * 1024 * 4, // 4MB
    uploadDate: new Date('2025-04-05'),
    startDate: new Date('2025-04-05'),
    endDate: new Date('2025-05-05'),
    displayDuration: 30,
    url: 'https://source.unsplash.com/random/800x600/?city',
    screenNumber: 2 // Added screen number
  }
];

// Auth functions
export const login = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username);
      if (user && user.password === password) {
        const { password, ...userWithoutPassword } = user;
        resolve({ ...userWithoutPassword, role: user.role as 'user' | 'admin' });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const register = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (MOCK_USERS.some(u => u.username === username)) {
        resolve(null);
      } else {
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          username,
          password,
          role: 'user' as const
        };
        MOCK_USERS.push(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }
    }, 500);
  });
};

// Media functions
export const getActiveMedia = (userId?: string): Promise<MediaType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const activeMedia = MOCK_MEDIA.filter(media => {
        const isActive = new Date(media.startDate) <= now && new Date(media.endDate) >= now;
        const isOwnedByUser = userId ? media.userId === userId : true;
        return isActive && isOwnedByUser;
      });
      resolve(activeMedia);
    }, 300);
  });
};

export const getAllUserMedia = (userId: string): Promise<MediaType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userMedia = MOCK_MEDIA.filter(media => media.userId === userId);
      resolve(userMedia);
    }, 300);
  });
};

export const getAllMedia = (): Promise<MediaType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MEDIA);
    }, 300);
  });
};

export const uploadMedia = (
  file: File,
  userId: string,
  startDate: Date,
  endDate: Date,
  displayDuration: number,
  screenNumber: number = 1 // Added screenNumber parameter with default value
): Promise<MediaType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMedia: MediaType = {
        id: String(MOCK_MEDIA.length + 1),
        userId,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date(),
        startDate,
        endDate,
        displayDuration,
        url: URL.createObjectURL(file),
        screenNumber // Added screen number
      };
      
      MOCK_MEDIA.push(newMedia);
      resolve(newMedia);
    }, 1000); // Simulating upload time
  });
};

export const deleteMedia = (mediaId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = MOCK_MEDIA.length;
      MOCK_MEDIA = MOCK_MEDIA.filter(media => media.id !== mediaId);
      resolve(MOCK_MEDIA.length < initialLength);
    }, 300);
  });
};

export const updateMediaSchedule = (
  mediaId: string,
  startDate: Date,
  endDate: Date,
  displayDuration: number
): Promise<MediaType | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mediaIndex = MOCK_MEDIA.findIndex(media => media.id === mediaId);
      if (mediaIndex !== -1) {
        MOCK_MEDIA[mediaIndex] = {
          ...MOCK_MEDIA[mediaIndex],
          startDate,
          endDate,
          displayDuration
        };
        resolve(MOCK_MEDIA[mediaIndex]);
      } else {
        resolve(null);
      }
    }, 300);
  });
};
