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
        <template v-if="item.children">
          <el-sub-menu
            :index="item.url"
            :key="item.url"
            v-show="hasPermission(item)"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                v-if="subItem.children"
                :index="subItem.url"
                :key="subItem.url"
                v-show="hasPermission(subItem)"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="threeItem.url"
                  v-show="hasPermission(threeItem)"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.url"
                :key="subItem.url + item.id"
                v-show="hasPermission(subItem)"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.url"
            :key="item.url"
            v-show="hasPermission(item)"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";
import { getResourceList, getPermissions } from "../common/global";
import { Resource } from "../common/interfaces";

const menus = ref(<Resource[]>[]);
const permission = ref(<Number[]>[]);
onMounted(async () => {
  menus.value.push(...(await getResourceList()));
  permission.value.push(...(await getPermissions()));
});

const hasPermission = (menu: Resource): boolean => {
  return permission.value.includes(menu.id);
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
