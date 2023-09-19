<template>
  <div>
    <el-table :data="stocks" style="width: 100%">
      <el-table-column type="index" label="编号" width="80"/>

      <el-table-column
          v-for="item in StockConfig"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          width="item.width"
          show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import type {Ref} from "vue";
import {Stock} from "../../common/interfaces";
import {getInventory} from "../../api";
import {StockConfig} from "./Stock.config";

// Data
const stocks: Ref<Stock[]> = ref([]);

// Methods
const loadInventory = async () => {
  const response = await getInventory();
  if (response && response.status == 200) {
    stocks.value = response.data;
  } else {
    console.log("load product data failed.");
  }
};

// Lifecycle hooks
onMounted(() => {
  loadInventory();
});
</script>
