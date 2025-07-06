export interface TgUserData {
  query_id: string;
  auth_date: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    allows_write_to_pm: boolean;
    photo_url: string;
  };
}

export interface VkUserData {
  vk_app_id: number;
  vk_are_notifications_enabled: number;
  vk_is_app_user: number;
  vk_is_favorite: number;
  vk_language: string;
  vk_platform: string;
  vk_ref: string;
  vk_ts: number;
  vk_user_id: number;
}
