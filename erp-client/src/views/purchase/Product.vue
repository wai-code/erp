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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="resetDialog" width="600px">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="140px">
        <template v-for="item in ProductConfig">
          <el-form-item :label="item.label" :prop="item.key">
            <template v-if="item.type === 'number'">
              <el-input-number v-model="formData[item.key]"/>
            </template>

            <template v-else-if="item.type === 'select'">
              <el-select v-model="formData[item.key]" placeholder="请选择">
                <el-option v-for="option in item.options"
                           :key="option.key"
                           :label="option.label"
                           :value="option.key"/>
              </el-select>
            </template>

            <template v-else-if="item.type === 'radio'">
              <el-radio-group v-model="formData[item.key]">
                <el-radio v-for="option in item.options"
                          :key="option.key"
                          :label="option.label"
                          :value="option.key"/>
              </el-radio-group>
            </template>

            <template v-else-if="item.type === 'date'">
              <el-date-picker type="date" placeholder="选择日期" v-model="formData[item.key]" style="width: 100%"/>
            </template>

            <template v-else-if="item.type === 'textarea'">
              <el-input type="textarea" :rows="2" v-model="formData[item.key]" style="resize:none"/>
            </template>

            <template v-else>
              <el-input v-model="formData[item.key]"/>
            </template>
          </el-form-item>
        </template>

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
import {Product} from "../../common/interfaces";
import {getProducts, addProduct, updateProduct, deleteProduct} from "../../api";
import {ProductConfig} from "./Product.config"; // Import your axios API functions

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
  name: [{required: true, message: "Please enter the name", trigger: "blur"}],
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
