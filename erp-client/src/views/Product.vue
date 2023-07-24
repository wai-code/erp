<template>
  <div class="supplier-management">
    <el-button type="primary" @click="showAddDialog">新增</el-button>

    <el-table :data="products" style="width: 100%">
      <el-table-column label="编号" prop="id" width="50"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="型号" prop="model"></el-table-column>
      <el-table-column label="制造标准" prop="standard"></el-table-column>
      <el-table-column label="供应商" prop="supplier_name"></el-table-column>
      <el-table-column label="采购价格" prop="purchase_price"></el-table-column>
      <el-table-column label="销售指导价" prop="sales_price"></el-table-column>
      <el-table-column label="Actions">
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="model">
              <el-input v-model="formData.model"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="制造标准" prop="phone">
              <el-input v-model="formData.standard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier_name">
              <el-input v-model="formData.supplier_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购价格" prop="purchase_price">
              <el-input v-model="formData.purchase_price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售价格" prop="sales_price">
              <el-input v-model="formData.sales_price"></el-input>
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
import { Product } from "../common/interfaces";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api"; // Import your axios API functions

// Data
const products: Ref<Product[]> = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const formData: Product = reactive({
  id: -1,
  name: "",
  model: "",
  standard: "",
  supplier_name: "",
  purchase_price: 0,
  sales_price: 0,
});
const rules = {
  name: [{ required: true, message: "Please enter the name", trigger: "blur" }],
};

// Methods
const loadSuppliers = async () => {
  const response = await getProducts();
  if (response && response.status == 200) {
    products.value = response.data;
  } else {
    console.log("load product data failed.");
  }
};

const showAddDialog = () => {
  dialogTitle.value = "新增产品";
  dialogVisible.value = true;
};

let selectedSupplierId = -1;
const showEditDialog = (product: Product) => {
  dialogTitle.value = "编辑产品";
  Object.assign(formData, product);
  selectedSupplierId = product.id;
  dialogVisible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogTitle.value === "新增产品") {
          const resp = await addProduct(formData);
          if (resp && resp.status == 200) {
            ElMessage.success("新增产品成功");
          }
        } else {
          const resp = await updateProduct(selectedSupplierId, formData);
          if (resp && resp.status == 200) {
            ElMessage.success("编辑产品成功");
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
    await deleteProduct(id);
    ElMessage.success("删除产品成功");
    loadSuppliers();
  } catch (error) {
    console.error(error);
    ElMessage.error("删除产品失败，请稍后重试");
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
