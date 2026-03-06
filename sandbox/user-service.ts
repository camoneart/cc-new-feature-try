// Sandbox user service for testing /simplify and /batch commands

import { formatDate, formatDateTime } from "./utils";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const users: User[] = [];

/**
 * 新しいユーザーを作成してストアに追加する
 * @param name - ユーザーの名前
 * @param email - ユーザーのメールアドレス
 * @returns 作成されたUserオブジェクト
 */
export function addUser(name: string, email: string): User {
  const now = new Date();
  const user: User = {
    id: Math.random().toString(36).substring(2, 15),
    name,
    email,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  return user;
}

/**
 * メールアドレスでユーザーを検索する
 * @param email - 検索するメールアドレス
 * @returns 見つかったUserオブジェクト、存在しない場合はundefined
 */
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

/**
 * IDでユーザーを検索する
 * @param id - 検索するユーザーID
 * @returns 見つかったUserオブジェクト、存在しない場合はundefined
 */
export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/**
 * 全ユーザーのメールアドレス一覧を取得する
 * @returns メールアドレスの配列
 */
export function getAllUserEmails(): string[] {
  return users.map((u) => u.email);
}

/**
 * 全ユーザーのサマリー文字列一覧を取得する
 * @returns ユーザー名、メール、作成日、更新日時を含むサマリー文字列の配列
 */
export function getUserSummaries(): string[] {
  return users.map((user) => {
    const createdDate = formatDate(user.createdAt);
    const updatedDate = formatDateTime(user.updatedAt);
    return `${user.name} (${user.email}) - created: ${createdDate}, updated: ${updatedDate}`;
  });
}

function updateUserField(
  id: string,
  updater: (user: User) => void,
): boolean {
  const user = findUserById(id);
  if (!user) return false;
  updater(user);
  user.updatedAt = new Date();
  return true;
}

/**
 * ユーザーの名前を更新する
 * @param id - 更新対象のユーザーID
 * @param newName - 新しい名前
 * @returns 更新に成功した場合はtrue、ユーザーが見つからない場合はfalse
 */
export function updateUserName(id: string, newName: string): boolean {
  return updateUserField(id, (user) => { user.name = newName; });
}

/**
 * ユーザーのメールアドレスを更新する
 * @param id - 更新対象のユーザーID
 * @param newEmail - 新しいメールアドレス
 * @returns 更新に成功した場合はtrue、ユーザーが見つからない場合はfalse
 */
export function updateUserEmail(id: string, newEmail: string): boolean {
  return updateUserField(id, (user) => { user.email = newEmail; });
}

/**
 * ユーザーをストアから削除する
 * @param id - 削除対象のユーザーID
 * @returns 削除に成功した場合はtrue、ユーザーが見つからない場合はfalse
 */
export function deleteUser(id: string): boolean {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

/**
 * 名前またはメールアドレスでユーザーを検索する（大文字小文字を区別しない）
 * @param query - 検索クエリ文字列
 * @returns 検索条件に一致するUserオブジェクトの配列
 */
export function searchUsers(query: string): User[] {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery),
  );
}

/**
 * APIからユーザー情報を取得し、ストアに保存する（既存ユーザーがいればそちらを返す）
 * @param apiUrl - ユーザー情報を取得するAPIのURL
 * @returns 取得または既存のUserオブジェクト
 */
export async function fetchAndStoreUser(apiUrl: string): Promise<User> {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return findUserByEmail(data.email) ?? addUser(data.name, data.email);
}

/**
 * 複数のAPIから並行してユーザー情報を取得し、ストアに保存する
 * @param urls - ユーザー情報を取得するAPIのURL配列
 * @returns 取得されたUserオブジェクトの配列
 */
export async function fetchMultipleUsers(urls: string[]): Promise<User[]> {
  return Promise.all(urls.map((url) => fetchAndStoreUser(url)));
}
