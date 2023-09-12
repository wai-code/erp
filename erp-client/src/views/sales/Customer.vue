<template>
  <div class="supplier-management">
    <el-button type="primary" @click="showAddDialog">新增</el-button>

    <el-table :data="suppliers" style="width: 100%">
      <el-table-column
        v-for="item in CustomerConfig"
        :key="item.key"
        :prop="item.key"
        :label="item.label"
        width="item.width"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <span class="action" @click="showEditDialog(row)">编辑</span>
          |
          <span class="action" @click="onDeleteCustomer(row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @close="resetDialog"
    >
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户国家" prop="email">
              <el-input v-model="formData.country"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户邮箱" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话" prop="contact_phone">
              <el-input v-model="formData.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户地址" prop="address">
              <el-input v-model="formData.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="其他信息" prop="other">
              <el-input v-model="formData.other"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)"
            >提交</el-button
          >
          <el-button @click="resetDialog(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import type { Ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Customer } from "../../common/interfaces";
import { CustomerConfig } from "./Customer.config";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api"; // Import your axios API functions

// Data
const suppliers: Ref<Customer[]> = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const formData: Customer = reactive({
  id: -1,
  name: "",
});
const rules = {
  name: [{ required: true, message: "Please enter the name", trigger: "blur" }],
};

// Methods
const loadCustomers = async () => {
  const response = await getCustomers();
  if (response && response.status == 200) {
    suppliers.value = response.data;
  } else {
    console.log("load supplier data failed.");
  }
};

const showAddDialog = () => {
  dialogTitle.value = "新增客户";
  dialogVisible.value = true;
};

let selectedCustomerId = -1;
const showEditDialog = (supplier: Customer) => {
  dialogTitle.value = "编辑客户";
  Object.assign(formData, supplier);
  selectedCustomerId = supplier.id;
  dialogVisible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogTitle.value === "新增客户") {
          const resp = await addCustomer(formData);
          if (resp && resp.status == 200) {
            ElMessage.success("新增客户成功");
          }
        } else {
          const resp = await updateCustomer(selectedCustomerId, formData);
          if (resp && resp.status == 200) {
            ElMessage.success("编辑客户成功");
          }
          selectedCustomerId = -1;
        }
      } catch (err) {
        ElMessage.error("保存失败");
      }
      selectedCustomerId = -1;
      resetDialog(formEl);
      await loadCustomers();
    } else {
      ElMessage.error("表单填写不正确");
      return false;
    }
  });
};

const resetDialog = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const onDeleteCustomer = async (id: number) => {
  try {
    await deleteCustomer(id);
    ElMessage.success("删除客户成功");
    loadCustomers();
  } catch (error) {
    console.error(error);
    ElMessage.error("删除客户失败，请稍后重试");
  }
};

// Lifecycle hooks
onMounted(() => {
  loadCustomers();
});
</script>
  
  <style>
.action {
  color: #409eff;
  cursor: pointer;
}
</style>
  