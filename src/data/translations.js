// Translation mappings for navigation items
// Can be updated independently for each language mode

export const translations = {
  en: {
    "CURRENT VENUE": "CURRENT VENUE",
    "Current Venue": "CURRENT VENUE",
    "Menu": "Menu",
    "Hours & Meal Periods": "Hours & Meal Periods",
    "Tables": "Tables",
    "Venue Settings": "Venue Settings",
    "GLOBAL": "GLOBAL",
    "Global": "GLOBAL",
    "Booking Theme": "Booking Theme",
    "Users": "Users",
    "Engagement": "Engagement",
    "Marketing Campaign": "Marketing Campaign",
    "Survey": "Survey",
    "Messaging": "Messaging",
    "Email Templates": "Email Templates",
    "Email Messages": "Email Messages",
    "SMS Messages": "SMS Messages",
    "Messenger Apps": "Messenger Apps",
    "Phone": "Phone",
    "CTI": "CTI",
    "Phone Calls": "Phone Calls",
    "Advanced": "Advanced",
    "Chains": "Chains",
    "Franchise": "Franchise",
    "Roles": "Roles",
    "Security Center": "Security Center",
    "Booking Widget": "Booking Widget",
    "Service Categories": "Service Categories",
    "Promo Codes": "Promo Codes",
    "Menu Templates": "Menu Templates",
    "Pace Rules": "Pace Rules",
    "Holidays": "Holidays",
    "Reservation Stasues": "Reservation Stasues",
    "Reservation Flags": "Reservation Flags",
    "Custom Labels": "Custom Labels",
    "Alert Rules": "Alert Rules",
    "Audit Trail": "Audit Trail",
    "Vouchers": "Vouchers",
    "Payment Gateways": "Payment Gateways",
    "Payment Gateways (V2)": "Payment Gateways (V2)",
    "Payment History": "Payment History",
    "Payment History (V2)": "Payment History (V2)",
    "Booking Sites": "Booking Sites",
    "Business Integrations": "Business Integrations",
    "Web Trackers": "Web Trackers",
    "Admin": "Admin",
    "Portal Venues List": "Portal Venues List",
    "Franchise Groups": "Franchise Groups",
    "TableCheck Users": "TableCheck Users",
    "User Query": "User Query",
    "Repeat Blocks": "Repeat Blocks",
    "App Notice": "App Notice",
    "SMS Templates": "SMS Templates",
    "SMS Prices": "SMS Prices",
    "Payment Diagnostics": "Payment Diagnostics",
    "Data Import": "Data Import",
    "CRM Integration": "CRM Integration",
    "Membership Programs": "Membership Programs",
    "POS Integration": "POS Integration",
    "Chit Printers": "Chit Printers",
    "Export Rules": "Export Rules",
    "SAML Providers": "SAML Providers",
    "TableCheck API": "TableCheck API",
    "Home": "Home"
  },
  ja: {
    "CURRENT VENUE": "現在の店舗",
    "Current Venue": "現在の店舗",
    "Menu": "メニュー",
    "Hours & Meal Periods": "営業シフト",
    "Tables": "テーブル",
    "Venue Settings": "店舗",
    "GLOBAL": "グローバル",
    "Global": "グローバル",
    "Booking Theme": "予約ページ用テーマ",
    "Users": "利用者",
    "Engagement": "エンゲージメント",
    "Marketing Campaign": "EDMマーケティング",
    "Survey": "カスタマーサーベイ",
    "Messaging": "メッセージング",
    "Email Templates": "メールテンプレート",
    "Email Messages": "Eメールメッセージ",
    "SMS Messages": "SMSメッセージ",
    "Messenger Apps": "メッセンジャーアプリ",
    "Phone": "電話連動",
    "CTI": "CTI (電話連動)",
    "Phone Calls": "通話",
    "Advanced": "高度な設定",
    "Chains": "チェーン",
    "Franchise": "系列店",
    "Roles": "権限設定",
    "Security Center": "セキュリティセンター",
    "Booking Widget": "予約ウィジェット",
    "Service Categories": "席のカテゴリ",
    "Promo Codes": "プロモーションコード",
    "Menu Templates": "Menu Templates",
    "Pace Rules": "Pace Rules",
    "Holidays": "Holidays",
    "Reservation Stasues": "Reservation Stasues",
    "Reservation Flags": "Reservation Flags",
    "Custom Labels": "Custom Labels",
    "Alert Rules": "Alert Rules",
    "Audit Trail": "Audit Trail",
    "Vouchers": "Vouchers",
    "Payment Gateways": "Payment Gateways",
    "Payment Gateways (V2)": "Payment Gateways (V2)",
    "Payment History": "Payment History",
    "Payment History (V2)": "Payment History (V2)",
    "Booking Sites": "Booking Sites",
    "Business Integrations": "Business Integrations",
    "Web Trackers": "Web Trackers",
    "Admin": "Admin",
    "Portal Venues List": "Portal Venues List",
    "Franchise Groups": "Franchise Groups",
    "TableCheck Users": "TableCheck Users",
    "User Query": "User Query",
    "Repeat Blocks": "Repeat Blocks",
    "App Notice": "App Notice",
    "SMS Templates": "SMS Templates",
    "SMS Prices": "SMS Prices",
    "Payment Diagnostics": "Payment Diagnostics",
    "Data Import": "Data Import",
    "CRM Integration": "CRM Integration",
    "Membership Programs": "Membership Programs",
    "POS Integration": "POS Integration",
    "Chit Printers": "Chit Printers",
    "Export Rules": "Export Rules",
    "SAML Providers": "SAML Providers",
    "TableCheck API": "TableCheck API",
    "Home": "ホーム"
  }
};

// Helper function to get translation
export const getTranslation = (text, language = 'en') => {
  if (!text) return text;
  const langTranslations = translations[language] || translations.en;
  
  // Try exact match first
  if (langTranslations[text]) {
    return langTranslations[text];
  }
  
  // Try uppercase version for section headers
  const upperText = text.toUpperCase();
  if (langTranslations[upperText]) {
    return langTranslations[upperText];
  }
  
  // Fallback to original text if translation not found
  return text;
};

