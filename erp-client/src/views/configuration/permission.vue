<template>
  <div class="container">
    <div class="mgb20">
      <span class="label">角色：</span>
      <el-select v-model="role" @change="handleChange">
        <el-option
          v-for="role in roles"
          :label="role.title"
          :value="role.name"
          :key="role.id"
        ></el-option>
      </el-select>
    </div>
    <div class="mgb20 tree-wrapper">
      <el-tree
        ref="tree"
        :data="resources"
        node-key="id"
        default-expand-all
        show-checkbox
        :default-checked-keys="checkedKeys"
      />
    </div>
    <el-button type="primary" @click="onSubmit">保存权限</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElTree, ElMessage } from "element-plus";
import * as api from "../../api";
import { getResourceList } from "../../common/global";
import { Resource } from "../../common/interfaces";

const role = ref<string>("Administrator");
const roles = ref<{ id: number; name: string; title: string }[]>([]);
const resources = ref<Resource[]>([]);
const checkedKeys = ref<number[]>([]);

onMounted(async () => {
  const response = await api.getRoleList();
  if (response && response.status === 200) {
    roles.value = await response.data;
  } else {
    console.log("get role list failed.");
  }

  resources.value = await getResourceList();
  await setDefaultPermission();
});

const setDefaultPermission = async () => {
  const resp = await api.getRolePermission(role.value);
  if (resp && resp.status === 200) {
    const resourceIds = <number[]>await resp.data;
    checkedKeys.value = resourceIds;
  } else {
    console.log("get role permissions failed.");
  }
};

const tree = ref<InstanceType<typeof ElTree>>();
const handleChange = async () => {
  await setDefaultPermission();
  tree.value!.setCheckedKeys(checkedKeys.value);
};

const onSubmit = () => {
  // 获取选中的权限
  const permissions = tree.value!.getCheckedKeys(false).join(",");
  api
    .updateRolePermission(role.value, permissions)
    .then((resp) => {
      if (resp && resp.status == 200) {
        ElMessage.success("设置权限成功");
      } else {
        ElMessage.error("设置权限失败");
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error("设置权限失败");
    });
};
</script>

<style scoped>
.tree-wrapper {
  max-width: 500px;
}
.label {
  font-size: 14px;
}
</style>
