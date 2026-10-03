import { MindMapGraph, ParsedDocument } from "@/types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface UserFileRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  wordCount: number;
  uploadedAt: string;
  parsedDoc?: ParsedDocument;
}

const AUTH_USER_KEY = "mindmap_ai_current_user";
const USER_FILES_KEY = "mindmap_ai_user_files_db";
const USER_MAPS_KEY = "mindmap_ai_user_maps_db";

/**
 * Gets currently logged in user (null by default if visitor hasn't signed in)
 */
export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Auth reading error", e);
  }
  return null;
}

export function setCurrentUser(user: UserProfile | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const googleUser: UserProfile = {
    id: `user-google-alex`,
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString()
  };
  setCurrentUser(googleUser);
  return googleUser;
}

export async function registerUser(name: string, email: string): Promise<UserProfile> {
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  setCurrentUser(newUser);
  return newUser;
}

export async function loginUser(email: string): Promise<UserProfile> {
  const name = email.split("@")[0].replace(/[._-]/g, " ");
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const user: UserProfile = {
    id: `user-${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
    name: capitalized,
    email,
    createdAt: new Date().toISOString()
  };
  setCurrentUser(user);
  return user;
}

export function logoutUser(): void {
  setCurrentUser(null);
}

/**
 * Get recent files strictly for specific user ID
 */
export function getUserRecentFiles(userId: string): UserFileRecord[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(`${USER_FILES_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save user uploaded file record strictly for user ID
 */
export function saveUserFileRecord(userId: string, doc: ParsedDocument): UserFileRecord {
  const record: UserFileRecord = {
    id: `file-rec-${Date.now()}`,
    userId,
    fileName: doc.fileName,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    wordCount: doc.metadata.wordCount,
    uploadedAt: new Date().toISOString(),
    parsedDoc: doc
  };

  if (typeof window !== "undefined" && userId) {
    const existing = getUserRecentFiles(userId);
    const updated = [record, ...existing.filter(f => f.fileName !== doc.fileName)].slice(0, 20);
    localStorage.setItem(`${USER_FILES_KEY}_${userId}`, JSON.stringify(updated));
  }

  return record;
}

/**
 * Get saved mind maps strictly for specific user ID
 */
export function getUserMindMaps(userId: string): MindMapGraph[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(`${USER_MAPS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save mind map graph strictly for user ID
 */
export function saveUserMindMapGraph(userId: string, graph: MindMapGraph): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const existing = getUserMindMaps(userId);
    const idx = existing.findIndex(g => g.id === graph.id);
    const updatedGraph = {
      ...graph,
      metadata: {
        ...graph.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    let newArr: MindMapGraph[];
    if (idx >= 0) {
      existing[idx] = updatedGraph;
      newArr = [...existing];
    } else {
      newArr = [updatedGraph, ...existing];
    }
    localStorage.setItem(`${USER_MAPS_KEY}_${userId}`, JSON.stringify(newArr));
  } catch (e) {
    console.error("Failed to save user mind map", e);
  }
}

/**
 * Delete user mind map graph strictly for user ID
 */
export function deleteUserMindMapGraph(userId: string, graphId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const existing = getUserMindMaps(userId);
    const filtered = existing.filter(g => g.id !== graphId);
    localStorage.setItem(`${USER_MAPS_KEY}_${userId}`, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete user mind map", e);
  }
}
