<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in menus">
        <template v-if="item.children && item.children.length > 0">
          <el-sub-menu
            :index="item.name"
            :key="item.name"
            v-show="hasPermission(item)"
            @click="handleMenuItemClick(item)"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.label }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                v-if="subItem.children && subItem.children.length > 0"
                :index="subItem.name"
                :key="subItem.name"
                v-show="hasPermission(subItem)"
                @click="handleMenuItemClick(subItem)"
              >
                <template #title>{{ subItem.label }}</template>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.name"
                :key="subItem.name + item.id"
                v-show="hasPermission(subItem)"
                @click="handleMenuItemClick(subItem)"
              >
                {{ subItem.label }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.name"
            :key="item.name"
            v-show="hasPermission(item)"
            @click="handleMenuItemClick(item)"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.label }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useSidebarStore } from "../../store/sidebar";
import { useRouter, useRoute } from "vue-router";
import { getResourceList, getPermissions } from "../../common/global";
import { Resource } from "../../common/interfaces";

const menus = ref(<Resource[]>[]);
const permission = ref(<number[]>[]);
onMounted(async () => {
  menus.value.push(...(await getResourceList()));
  permission.value.push(...(await getPermissions()));
});

const hasPermission = (menu: Resource): boolean => {
  return permission.value.includes(menu.id);
};

const router = useRouter();
const handleMenuItemClick = (menu: Resource) => {
  if (menu.url) {
    router.push(menu.url);
  }
};

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
