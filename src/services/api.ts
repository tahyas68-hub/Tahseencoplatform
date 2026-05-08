const API_URL = '/api';

export interface Course {
  id: number;
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
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async addCourse(courseData: Partial<Course>): Promise<{ id: number }> {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Failed to add course');
    return res.json();
  },

  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  }
};
