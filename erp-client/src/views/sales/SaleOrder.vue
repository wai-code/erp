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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @close="cancle"
      width="680px"
    >
      <el-form :model="formData" ref="formRef" label-width="140px">
        <el-form-item label="产品" prop="product_id">
          <el-select v-model="formData.product_id" placeholder="请选择">
            <el-option
              v-for="option in products"
              :key="option.id"
              :label="
                option.name +
                ' - ' +
                option.model +
                ' - ' +
                option.standard +
                ' - ' +
                option.supplier_name
              "
              :value="option.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price"></el-input-number>
        </el-form-item>

        <el-form-item label="订单日期" prop="order_date">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formData.order_date"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="最后发货日期" prop="latest_shipment_date">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formData.latest_shipment_date"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="客户" prop="customer_id">
          <el-input v-model="formData.customer_id" />
        </el-form-item>

        <el-form-item label="运往国家" prop="shipping_country">
          <el-input-number
            v-model="formData.shipping_country"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="是否开发票" prop="is_invoice_issued">
          <el-switch v-model="formData.is_invoice_issued" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="是否样品订单" prop="is_sample_order">
          <el-switch v-model="formData.is_sample_order" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="参考汇率" prop="exchange_rate">
          <el-input-number v-model="formData.exchange_rate"></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirm(formRef)">提交</el-button>
          <el-button @click="cancle(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { Ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";

import { SaleOrderConfig } from "./SaleOrder.config";
import { SaleOrderBase, Product } from "../../common/interfaces";
import {
  getSaleOrders,
  getProducts,
  getSaleOrder,
  addSaleOrder,
} from "../../api";

const products: Ref<Product[]> = ref([]);

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

const loadProducts = async () => {
  const response = await getProducts();
  if (response && response.status == 200) {
    products.value = response.data;
  } else {
    console.log("load product data failed.");
  }
};

const showAddDialog = () => {
  dialogTitle.value = "新增销售订单";
  dialogVisible.value = true;
};

// Lifecycle hooks
onMounted(() => {
  loadSaleOrders();
  loadProducts();
});

const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        await loadSaleOrders();
      } catch (err) {}
    } else {
      ElMessage.error("表单填写不正确");
      return false;
    }
  });
};

const cancle = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped></style>