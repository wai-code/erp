<template>
    <div class="supplier-management">
      <el-button type="primary" @click="showAddDialog">新增</el-button>
  
      <el-table :data="suppliers" style="width: 100%">
        <el-table-column label="编号" prop="id" ></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="联系人" prop="contact_name"></el-table-column>
        <el-table-column
          label="联系人邮箱"
          prop="contact_email"
        ></el-table-column>
        <el-table-column label="联系电话" prop="contact_phone"></el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="国家" prop="country"></el-table-column>
        <el-table-column label="其他信息" prop="other"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <span class="action" @click="showEditDialog(row)">编辑</span>
            |
            <span class="action" @click="onDeleteSupplier(row.id)">删除</span>
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
              <el-form-item label="联系人" prop="contact_name">
                <el-input v-model="formData.contact_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人邮箱" prop="contact_email">
                <el-input v-model="formData.contact_email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="contact_phone">
                <el-input v-model="formData.contact_phone"></el-input>
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
  import { Supplier } from "../../common/interfaces";
  import {
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } from "../../api"; // Import your axios API functions
  
  // Data
  const suppliers: Ref<Supplier[]> = ref([]);
  const dialogVisible = ref(false);
  const dialogTitle = ref("");
  const formRef = ref<FormInstance>();
  const formData: Supplier = reactive({
    id: -1,
    name: "",
  });
  const rules = {
    name: [{ required: true, message: "Please enter the name", trigger: "blur" }],
  };
  
  // Methods
  const loadSuppliers = async () => {
    const response = await getSuppliers();
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
  
  let selectedSupplierId = -1;
  const showEditDialog = (supplier: Supplier) => {
    dialogTitle.value = "编辑客户";
    Object.assign(formData, supplier);
    selectedSupplierId = supplier.id;
    dialogVisible.value = true;
  };
  
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
  
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          if (dialogTitle.value === "新增客户") {
            const resp = await addSupplier(formData);
            if (resp && resp.status == 200) {
              ElMessage.success("新增客户成功");
            }
          } else {
            const resp = await updateSupplier(selectedSupplierId, formData);
            if (resp && resp.status == 200) {
              ElMessage.success("编辑客户成功");
            }
            selectedSupplierId = -1;
          }
        } catch (err) {
          ElMessage.error("保存失败");
        }
        selectedSupplierId = -1;
        resetDialog(formEl);
        await loadSuppliers();
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
  
  const onDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      ElMessage.success("删除客户成功");
      loadSuppliers();
    } catch (error) {
      console.error(error);
      ElMessage.error("删除客户失败，请稍后重试");
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    loadSuppliers();
  });
  </script>
  
  <style>
  .action {
    color: #409eff;
    cursor: pointer;
  }
  </style>
  