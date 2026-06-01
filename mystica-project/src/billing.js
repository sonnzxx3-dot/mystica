// ============================================================
//  billing.js — подписки через Google Play Billing (RevenueCat)
//  Два тарифа: basic (199₽) и pro (299₽)
//
//  ШАГИ ПОДКЛЮЧЕНИЯ (см. GUIDE):
//  1. Зарегистрируйся на revenuecat.com (бесплатно)
//  2. Создай проект, привяжи Google Play
//  3. В Play Console создай подписки с ID:
//       mystica_basic  — 199 ₽/мес
//       mystica_pro    — 299 ₽/мес
//  4. В RevenueCat создай два Entitlement: "basic" и "pro"
//  5. Вставь свой публичный ключ Google ниже (REVENUECAT_API_KEY)
// ============================================================

import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

const REVENUECAT_API_KEY = "goog_ВАШ_КЛЮЧ_ЗДЕСЬ"; // ← вставь ключ из RevenueCat

// ID продуктов в Google Play
export const PRODUCT_IDS = {
  basic: "mystica_basic",
  pro: "mystica_pro",
};

let initialized = false;

// Инициализация — вызови один раз при старте приложения
export async function initBilling() {
  // На вебе (в браузере) биллинг не работает — пропускаем
  if (!Capacitor.isNativePlatform()) {
    console.log("[billing] Веб-режим: биллинг отключён (только нативная сборка).");
    return false;
  }
  if (initialized) return true;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    initialized = true;
    return true;
  } catch (e) {
    console.error("[billing] Ошибка инициализации:", e);
    return false;
  }
}

// Определить текущий тариф пользователя: "none" | "basic" | "pro"
export async function getTier() {
  if (!Capacitor.isNativePlatform()) return "none";
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const active = customerInfo.entitlements.active || {};
    if (active["pro"]) return "pro";
    if (active["basic"]) return "basic";
    return "none";
  } catch (e) {
    console.error("[billing] getTier:", e);
    return "none";
  }
}

// Получить доступные пакеты подписок для показа цен
export async function getOfferings() {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current; // содержит availablePackages
  } catch (e) {
    console.error("[billing] getOfferings:", e);
    return null;
  }
}

// Купить подписку. tier: "basic" | "pro"
// packageToBuy — объект пакета из getOfferings()
export async function purchase(packageToBuy) {
  if (!Capacitor.isNativePlatform()) {
    console.log("[billing] Веб-режим: покупка симулируется.");
    return "pro"; // в браузере просто разблокируем для теста
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToBuy });
    const active = customerInfo.entitlements.active || {};
    if (active["pro"]) return "pro";
    if (active["basic"]) return "basic";
    return "none";
  } catch (e) {
    if (e.userCancelled) {
      console.log("[billing] Покупка отменена пользователем.");
    } else {
      console.error("[billing] purchase:", e);
    }
    return "none";
  }
}

// Восстановить покупки (смена устройства и т.п.)
export async function restore() {
  if (!Capacitor.isNativePlatform()) return "none";
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const active = customerInfo.entitlements.active || {};
    if (active["pro"]) return "pro";
    if (active["basic"]) return "basic";
    return "none";
  } catch (e) {
    console.error("[billing] restore:", e);
    return "none";
  }
}
