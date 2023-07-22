<template>
  <div>
    <div class="container">
      <el-button primary text :icon="Plus" @click="handleAdd"> 新增 </el-button>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="role">
            <el-option
              v-for="role in roles"
              :label="role.title"
              :value="role.name"
              :key="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, pushScopeId } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search, Plus, User } from "@element-plus/icons-vue";
import * as api from "../api";

interface User {
  name: string;
  phone: string;
  email: string;
  role: string;
}

const tableData = ref<User[]>([]);
const role = ref<string>("Administrator");
const roles = ref<{ id: number; name: string; title: string }[]>([]);

onMounted(async () => {
  let res = await api.getUserList();
  if (res && res.status === 200) {
    tableData.value.push(...res.data);
  }

  const response = await api.getRoleList();
  if (response && response.status === 200) {
    roles.value.push(...(await response.data));
  } else {
    console.log("get role list failed.");
  }
});

// 删除操作
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  })
    .then(() => {
      api.deleteUser(row.name).then((resp) => {
        if (resp && resp.status === 200) {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};

// 表格编辑时弹窗和保存
type FormFlag = "add" | "edit";
const flag = ref<FormFlag>("add");
const editVisible = ref(false);
let form = reactive({
  name: "",
  role: "",
  phone: "",
  email: "",
  password: "",
});

const handleAdd = () => {
  form.name = "";
  form.role = role.value;
  form.email = "";
  form.phone = "";
  form.password = "";
  editVisible.value = true;
  flag.value = "add";
};
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.name = row.name;
  form.role = row.role;
  form.email = row.email;
  form.phone = row.phone;
  form.password = row.password;
  editVisible.value = true;
  flag.value = "edit";
};
const saveData = () => {
  editVisible.value = false;
  if (flag.value === "add") {
    api
      .addUser(form)
      .then((res) => {
        if (res && res.status == 200) {
          success();
        } else {
          ElMessage.error("创建用户失败。");
        }
      })
      .catch(() => {
        ElMessage.error("创建用户失败。");
      });
  }
  if (flag.value === "edit") {
    api.updateUser(form).then((res) => {
      if (res && res.status == 200) {
        success();
      } else {
        ElMessage.error("修改用户信息失败。");
      }
    });
  }
};

const success = () => {
  if (flag.value === "add") {
    tableData.value.push({
      name: form.name,
      role: form.role,
      phone: form.phone,
      email: form.email,
    });
    ElMessage.success(`创建新用户成功`);
  }
  if (flag.value === "edit") {
    tableData.value[idx].name = form.name;
    tableData.value[idx].role = form.role;
    tableData.value[idx].phone = form.phone;
    tableData.value[idx].email = form.email;
    ElMessage.success(`修改第 ${idx + 1} 行用户信息成功`);
  }
};
const failed = () => {};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
