import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export interface Course {
  id: string; // Changed from number to string for Firestore
  title: string;
  description: string;
  price: string;
  duration: string;
  instructor: string;
  videoUrl?: string;
  type: string;
  students: number;
}

export const api = {
  async getCourses(): Promise<Course[]> {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as Course);
    });
    return courses;
  },

  async addCourse(courseData: Partial<Course>): Promise<{ id: string }> {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  },

  async updateCourse(id: string, courseData: Partial<Course>): Promise<void> {
    const docRef = doc(db, 'courses', id);
    await setDoc(docRef, {
      ...courseData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  uploadFile(file: File, onProgress: (progress: number) => void): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadURL, filename: file.name });
        }
      );
    });
  }
};
