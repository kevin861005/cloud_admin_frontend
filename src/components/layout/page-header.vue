<template>
  <!--
    Container 上方固定區塊

    功能：
    1. 左側：選單收合/展開按鈕
    2. 中間：
       - 總覽頁面：不顯示任何內容
       - 子頁面（如 /environment/delete-records）：顯示「返回上一頁」按鈕
       - 主功能頁面（左側選單中的頁面）：顯示「返回總覽」按鈕
    3. 右側：即時時間 + 使用者名稱（hover 顯示登出選單）

    樣式參考 Figma：
    - 高度：64px
    - 左右 padding：40px
    - 背景：白色
    - 陰影：底部淡灰色陰影
  -->
  <div
    id="page-header"
    class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-10 shadow-[1px_3px_4px_0_rgba(0,0,0,0.10)]"
  >
    <!-- 左側：選單收合按鈕 -->
    <div class="flex items-center gap-4">
      <!-- 收合/展開按鈕 -->
      <button
        @click="handleToggleMenu"
        class="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-100"
        :title="menuStore.isCollapsed ? '展開選單' : '收合選單'"
      >
        <img src="@/assets/icons/common/cm-menu-toggle.svg" alt="選單" class="h-4 w-4" />
      </button>

      <!-- 中間：返回按鈕（根據路由層級顯示不同文字） -->
      <div v-if="showBackButton">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-800"
        >
          <!-- 左箭頭 ICON（16x16px SVG） -->
          <img src="@/assets/icons/common/cm-back-arrow.svg" alt="返回" class="h-4 w-4" />
          <!-- 文字：根據路由層級動態顯示 -->
          <span class="text-sm">{{ backButtonText }}</span>
        </button>
      </div>
    </div>

    <!-- 右側：即時時間 + 使用者名稱 -->
    <div class="flex items-center gap-6">
      <!-- 即時時間（格式：YYYY.MM.DD HH:mm:ss） -->
      <div class="typo-sm text-neutral-900">
        {{ currentTime }}
      </div>

      <!-- 使用者名稱 + 登出下拉選單 -->
      <div class="relative" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
        <!-- 使用者名稱 -->
        <div
          class="typo-sm-medium cursor-pointer text-right transition-colors"
          :class="showDropdown ? 'text-primary-500' : 'text-neutral-900 hover:text-primary-500'"
        >
          {{ userName }}
        </div>

        <!-- 下拉選單容器（pt-2 確保間距區域仍在 hover 範圍內） -->
        <div v-show="showDropdown" class="absolute right-0 top-full pt-2">
          <!-- 最外框：之後可加入其他功能項目 -->
          <div
            class="flex w-[200px] flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg"
          >
            <!-- 登出框 -->
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="group flex w-full items-center gap-1 rounded p-2 transition-colors hover:bg-neutral-100"
            >
              <!-- 登出 Icon -->
              <img
                src="@/assets/icons/common/cm-logout.svg"
                alt="登出"
                class="h-4 w-4 transition-colors [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(5%)_saturate(500%)_hue-rotate(180deg)] group-hover:[filter:brightness(0)_saturate(100%)_invert(45%)_sepia(98%)_saturate(1500%)_hue-rotate(200deg)_brightness(95%)]"
              />
              <!-- 登出文字 -->
              <span
                class="typo-sm-medium text-neutral-800 transition-colors group-hover:text-primary-500"
              >
                {{ isLoggingOut ? "登出中..." : "登出" }}
              </span>
            </button>

            <!-- 之後可在這裡加入其他功能項目，例如： -->
            <!-- <button class="group flex w-full items-center gap-1 rounded p-2 transition-colors hover:bg-neutral-100">
        <img src="..." alt="設定" class="h-4 w-4" />
        <span class="typo-sm-medium text-neutral-800 group-hover:text-primary-500">個人設定</span>
      </button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤訊息 Toast -->
    <div
      v-if="errorMessage"
      class="fixed right-4 top-20 z-50 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMenuStore } from "@/stores/menu.store";
import { useAuthStore } from "@/stores/auth.store";

// ==================== Composables ====================

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const authStore = useAuthStore();

// ==================== Constants ====================

/**
 * 主功能頁面路徑列表
 * 這些是左側選單中的頁面，點擊返回按鈕應該回到總覽
 */
const MAIN_FEATURE_PATHS = [
  "/customers",
  "/environment",
  "/settings/accounts",
  "/settings/roles",
  "/settings/modules",
  "/settings/industries",
  "/settings/dealers",
];

// ==================== State ====================

/**
 * 當前時間（格式：YYYY.MM.DD HH:mm:ss）
 */
const currentTime = ref<string>("");

/**
 * 定時器 ID（用於清除定時器）
 */
let timerInterval: number | null = null;

/**
 * 是否顯示下拉選單
 */
const showDropdown = ref<boolean>(false);

/**
 * 是否正在登出
 */
const isLoggingOut = ref<boolean>(false);

/**
 * 錯誤訊息
 */
const errorMessage = ref<string>("");

// ==================== Computed ====================

/**
 * 是否為總覽頁面
 */
const isOverviewPage = computed(() => {
  return route.name === "Overview" || route.path === "/overview" || route.path === "/";
});

/**
 * 是否為新增帳號頁面
 */
const isAccountCreatePage = computed(() => {
  return route.name === "AccountCreate" || route.path === "/settings/accounts/create";
});

/**
 * 是否為新增模組頁面
 */
const isModuleCreatePage = computed(() => {
  return route.name === "ModuleCreate" || route.path === "/settings/modules/create";
});

/**
 * 是否為新增產業別頁面
 */
const isIndustryCreatePage = computed(() => {
  return route.name === "IndustryCreate" || route.path === "/settings/industries/create";
});

/**
 * 是否為新增經銷商頁面
 */
const isDealerCreatePage = computed(() => {
  return route.name === "DealerCreate" || route.path === "/settings/dealers/create";
});

/**
 * 是否為主功能頁面
 * 主功能頁面：在左側選單中的頁面
 */
const isMainFeaturePage = computed(() => {
  return MAIN_FEATURE_PATHS.includes(route.path);
});

/**
 * 是否顯示返回按鈕
 * 只有總覽頁面不顯示
 */
const showBackButton = computed(() => {
  return (
    !isOverviewPage.value &&
    !isAccountCreatePage.value &&
    !isModuleCreatePage.value &&
    !isIndustryCreatePage.value &&
    !isDealerCreatePage.value
  );
});

/**
 * 返回按鈕文字
 * - 主功能頁面：「返回總覽」
 * - 子頁面：「返回上一頁」
 */
const backButtonText = computed(() => {
  return isMainFeaturePage.value ? "返回總覽" : "返回上一頁";
});

/**
 * 使用者名稱
 */
const userName = computed(() => {
  return authStore.userName || "訪客";
});

// ==================== Methods ====================

/**
 * 格式化時間
 * 格式：YYYY.MM.DD HH:mm:ss
 */
function formatTime(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 更新當前時間
 */
function updateTime() {
  currentTime.value = formatTime();
}

/**
 * 處理選單收合/展開
 */
function handleToggleMenu() {
  menuStore.toggleCollapsed();
}

/**
 * 處理返回邏輯
 * - 主功能頁面：返回總覽頁面
 * - 子頁面：返回父路徑
 */
function handleBack() {
  if (isMainFeaturePage.value) {
    // 主功能頁面：返回總覽
    router.push({ name: "Overview" });
  } else {
    // 子頁面：返回父路徑
    const parentPath = getParentPath(route.path);
    router.push(parentPath);
  }
}

/**
 * 取得父路徑
 * 根據不同頁面類型返回對應的父路徑：
 * - 編輯頁面 (/customers/:id/edit) → 詳細頁 (/customers/:id/detail)
 * - 詳細頁面 (/customers/:id/detail) → 列表頁 (/customers)
 * - 其他子頁面 → 主功能頁面（列表頁）
 */
function getParentPath(path: string): string {
  // 1. 編輯頁面：返回詳細頁
  // 例如：/customers/allen322/edit → /customers/allen322/detail
  if (path.endsWith("/edit")) {
    return path.replace("/edit", "/detail");
  }

  // 2. 找出當前路徑對應的主功能頁面
  const mainFeaturePath = MAIN_FEATURE_PATHS.find(
    (mainPath) => path.startsWith(mainPath + "/") || path === mainPath
  );

  if (mainFeaturePath && path !== mainFeaturePath) {
    // 子頁面：直接返回主功能頁面
    return mainFeaturePath;
  }

  // 3. 其他情況：返回上一層（保底邏輯）
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return "/" + segments.join("/");
}

/**
 * 處理登出
 */
async function handleLogout() {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  errorMessage.value = "";

  try {
    await authStore.logout();
    // 登出成功，跳轉到登入頁
    router.push("/login");
  } catch (error) {
    // 登出失敗，顯示錯誤訊息
    errorMessage.value = error instanceof Error ? error.message : "登出失敗，請稍後再試";

    // 3 秒後自動清除錯誤訊息
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } finally {
    isLoggingOut.value = false;
    showDropdown.value = false;
  }
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時：
 * 1. 立即更新一次時間
 * 2. 啟動定時器（每秒更新時間）
 */
onMounted(() => {
  updateTime();
  timerInterval = window.setInterval(updateTime, 1000);
});

/**
 * 元件卸載時：清除定時器
 */
onUnmounted(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
});
</script>
