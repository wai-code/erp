<template>
  <div>
    <el-button type="primary" @click="showAddDialog">新增</el-button>

    <el-table :data="products" style="width: 100%">
      <el-table-column type="index" label="编号" width="80"/>

      <el-table-column
          v-for="item in ProductConfig"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          width="item.width"
          show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column label="Actions">
        <template #default="{ row }">
          <span class="action" @click="showEditDialog(row)">编辑</span>
          |
          <span class="action" @click="onDeleteSupplier(row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="resetDialog" width="680px">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="140px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>

        <el-form-item label="型号" prop="model">
          <el-input v-model="formData.model"></el-input>
        </el-form-item>

        <el-form-item label="制造标准" prop="standard">
          <el-select v-model="formData.standard" placeholder="请选择">
            <el-option v-for="option in standards"
                       :key="option.key"
                       :label="option.label"
                       :value="option.key"/>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" prop="supplier_name">
          <el-select v-model="formData.supplier_name" placeholder="请选择">
            <el-option v-for="option in suppliers"
                       :key="option.id"
                       :label="option.name"
                       :value="option.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="采购价格" prop="purchase_price">
          <el-input-number v-model="formData.purchase_price"></el-input-number>
        </el-form-item>

        <el-form-item label="销售价格" prop="sales_price">
          <el-input-number v-model="formData.sales_price"></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
          <el-button @click="resetDialog(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted} from "vue";
import type {Ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {Product, Supplier} from "../../common/interfaces";
import {getProducts, addProduct, updateProduct, deleteProduct, getSuppliers} from "../../api";
import {ProductConfig} from "./Product.config"; // Import your axios API functions

// Data
const products: Ref<Product[]> = ref([]);
const suppliers: Ref<Supplier[]> = ref([]);
const standards: Ref<any> = ref([{key: "StandardA", label: "标准A"}, {key: "StandardB", label: "标准B"}])
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
  name: [{required: true, message: "Please enter the name", trigger: "blur"}],
};

// Methods
const loadProducts = async () => {
  const response = await getProducts();
  if (response && response.status == 200) {
    products.value = response.data;
  } else {
    console.log("load product data failed.");
  }
};

const loadSuppliers = async () => {
  const response = await getSuppliers();
  if (response && response.status == 200) {
    suppliers.value = response.data;
  } else {
    console.log("load supplier data failed.");
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
      await loadProducts();
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
    loadProducts();
  } catch (error) {
    console.error(error);
    ElMessage.error("删除产品失败，请稍后重试");
  }
};

// Lifecycle hooks
onMounted(() => {
  loadProducts();
  loadSuppliers();
});
</script>

<style>
.action {
  color: #409eff;
  cursor: pointer;
}
</style>
