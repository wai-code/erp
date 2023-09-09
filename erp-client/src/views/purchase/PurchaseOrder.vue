<template>
  <div>
    <el-button type="primary" @click="showAddDialog">新增</el-button>

    <el-table :data="purchaseOrders" style="width: 100%">
      <el-table-column type="index" label="编号" width="80"/>

      <el-table-column
          v-for="item in PurchaseOrderConfig"
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
          <span class="action" @click="onDeletePurchase(row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="resetDialog" width="600px">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="140px">
        <template v-for="item in PurchaseOrderConfig">
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
import {ref, reactive, onMounted} from "vue";
import type {Ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {PurchaseOrderBase} from "../../common/interfaces";
import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
} from "../../api";
import {PurchaseOrderConfig} from "./PurchaseOrder.config";

// Data
const purchaseOrders: Ref<PurchaseOrderBase[]> = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const formData: PurchaseOrderBase = reactive({
  id: -1,
  order_id: "",
});
const rules = {
  type: [{required: true, message: "Please enter the name", trigger: "blur"}],
  unit_price: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
  purchase_quantity: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
  plan_quantity: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
  arrival_quantity: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
};

// Methods
const loadPurchases = async () => {
  const response = await getPurchases();
  if (response && response.status == 200) {
    purchaseOrders.value = response.data;
  } else {
    console.log("load purchase data failed.");
  }
};

const showAddDialog = () => {
  dialogTitle.value = "新增采购订单";
  dialogVisible.value = true;
};

let selectedPurchaseId = -1;
const showEditDialog = (purchaseOrder: PurchaseOrderBase) => {
  dialogTitle.value = "编辑供应商";
  Object.assign(formData, purchaseOrder);
  selectedPurchaseId = purchaseOrder.id;
  dialogVisible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogTitle.value === "新增采购订单") {
          const resp = await addPurchase(formData);
          if (resp && resp.status == 200) {
            ElMessage.success("新增采购订单成功");
          }
        } else {
          const resp = await updatePurchase(selectedPurchaseId, formData);
          if (resp && resp.status == 200) {
            ElMessage.success("更新采购订单成功");
          }
          selectedPurchaseId = -1;
        }
      } catch (err) {
        ElMessage.error("保存失败");
      }
      selectedPurchaseId = -1;
      resetDialog(formEl);
      await loadPurchases();
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

const onDeletePurchase = async (id: number) => {
  try {
    await deletePurchase(id);
    ElMessage.success("删除采购订单成功");
    loadPurchases();
  } catch (error) {
    console.error(error);
    ElMessage.error("删除采购订单失败，请稍后重试");
  }
};

// Lifecycle hooks
onMounted(() => {
  loadPurchases();
});
</script>

<style scoped></style>