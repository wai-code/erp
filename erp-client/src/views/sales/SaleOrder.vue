<template>
  <div>
    <el-button type="primary" @click="showAddDialog">新增</el-button>

    <el-table :data="saleOrders" style="width: 100%">
      <el-table-column type="index" label="编号" width="80" />

      <el-table-column
        v-for="item in SaleOrderConfig"
        :key="item.key"
        :prop="item.key"
        :label="item.label"
        width="item.width"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column label="Actions">
        <template #default="{ row }">
          <!-- <span class="action" @click="showEditDialog(row)">编辑</span>
          |
          <span class="action" @click="onDeletePurchase(row.id)">删除</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { Ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";

import { SaleOrderConfig } from "./SaleOrder.config";
import { SaleOrderBase } from "../../common/interfaces";

import { getSaleOrders, getSaleOrder, addSaleOrder } from "../../api";

// Data
const saleOrders: Ref<SaleOrderBase[]> = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const formData: SaleOrderBase = reactive({
  id: -1,
  order_id: "",
});

// Methods
const loadSaleOrders = async () => {
  const response = await getSaleOrders();
  if (response && response.status == 200) {
    saleOrders.value = response.data;
  } else {
    console.log("load sale orders data failed.");
  }
};

const showAddDialog = () => {
  dialogTitle.value = "新增销售订单";
  dialogVisible.value = true;
};

// Lifecycle hooks
onMounted(() => {
  loadSaleOrders();
});
</script>
<style scoped></style>