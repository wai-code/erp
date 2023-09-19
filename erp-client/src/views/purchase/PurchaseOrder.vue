<template>
  <div>
    <el-button type="primary" @click="showAddPurchase">新增</el-button>

    <el-table :data="purchaseOrders" @expand-change="loadPurchaseArrivalPlan" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="purchaseArrivalPlans">
            <el-table-column type="index" label="编号" width="80"/>

            <el-table-column
                v-for="item in PurchaseArrivalPlanConfig"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                width="item.width"
                show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column label="Actions" width="180">
              <template #default="{ row }">
                <span class="action" @click="showReceipt(row)">收货</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

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

      <el-table-column label="Actions" width="180">
        <template #default="{ row }">
          <span class="action" @click="onDeletePurchase(row.id)">完成订单</span>
          |
          <span class="action" @click="onDeletePurchase(row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="addPurchaseVisible" :title="addPurchaseTitle" @close="resetAddPurchase" width="680px">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="140px">
        <el-form-item label="订单编号" prop="order_id">
          <el-input v-model="formData.order_id"></el-input>
        </el-form-item>

        <el-form-item label="采购类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option v-for="option in productTypes"
                       :key="option.key"
                       :label="option.label"
                       :value="option.key"/>
          </el-select>
        </el-form-item>

        <el-form-item label="产品" prop="product_id">
          <el-select v-model="formData.product_id" placeholder="请选择">
            <el-option v-for="option in products"
                       :key="option.id"
                       :label="option.name+' - '+option.model+' - '+option.standard+' - '+option.supplier_name"
                       :value="option.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="单价" prop="unit_price">
          <el-input-number v-model="formData.unit_price"/>
        </el-form-item>

        <el-form-item label="采购数量" prop="purchase_quantity">
          <el-input-number v-model="formData.purchase_quantity"/>
        </el-form-item>

        <el-form-item label="计划发货数量" prop="plan_quantity">
          <el-input-number v-model="formData.plan_quantity"/>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" :rows="2" v-model="formData.description" style="resize:none"/>
        </el-form-item>

        <el-form-item label="发货计划" prop="arrivalPlans">
          <el-table :data="formData.arrivalPlans" style="width: 100%">
            <el-table-column label="批次计划发货日期" prop="plan_date">
              <template #default="{row}">
                <el-date-picker type="date" placeholder="选择日期" v-model="row.plan_date"
                                style="width: 100%"/>
              </template>
            </el-table-column>

            <el-table-column label="批次计划发货数量" prop="plan_quantity">
              <template #default="{row}">
                <el-input-number v-model="row.plan_quantity"/>
              </template>
            </el-table-column>

            <el-table-column>
              <template #default="{row,i}">
                <el-button circle @click="addArrivalPlans()">
                  <el-icon>
                    <Plus/>
                  </el-icon>
                </el-button>

                <el-button circle @click="subArrivalPlans(i)">
                  <el-icon>
                    <Minus/>
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirmPurchase(formRef)">提交</el-button>
          <el-button @click="resetAddPurchase(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="receiptVisible" :title="receiptTitle" @close="resetReceipt" width="680px">
      <el-form :model="receiptData" ref="formRef" label-width="140px">
        <el-form-item label="收货数量" prop="arrival_quantity">
          <el-input-number v-model="receiptData.arrival_quantity"></el-input-number>
        </el-form-item>

        <el-form-item label="入库数量" prop="arrival_quantity">
          <el-input-number v-model="receiptData.arrival_quantity"></el-input-number>
        </el-form-item>

        <el-form-item label="收货时间" prop="arrival_date">
          <el-date-picker type="date" placeholder="选择日期" v-model="receiptData.arrival_date" style="width: 100%"/>
        </el-form-item>

        <el-form-item label="运输方式" prop="shipping_method">
          <el-input-number v-model="receiptData.shipping_method"/>
        </el-form-item>

        <el-form-item label="运费" prop="shipping_cost">
          <el-input-number v-model="receiptData.shipping_cost"></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirmReceipt(formRef)">提交</el-button>
          <el-button @click="resetReceipt(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import type {Ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {Product, PurchaseArrivalPlan, PurchaseOrderBase} from "../../common/interfaces";
import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase, getProducts, getPurchaseArrivalPlan, addPurchaseArrivalPlan, updatePurchaseArrivalPlan
} from "../../api";
import {PurchaseOrderConfig} from "./PurchaseOrder.config";
import {PurchaseArrivalPlanConfig} from "./PurchaseArrivalPlan.config";

// Data
const purchaseOrders: Ref<PurchaseOrderBase[]> = ref([]);
const products: Ref<Product[]> = ref([]);
const productTypes: Ref<any> = ref([{key: "product", label: "产品"}, {key: "accessory", label: "配件"}]);
const purchaseArrivalPlans: Ref<PurchaseArrivalPlan[]> = ref([]);
const addPurchaseVisible = ref(false);
const addPurchaseTitle = ref("");
const receiptVisible = ref(false);
const receiptTitle = ref("");
const formRef = ref<FormInstance>();
const formData: PurchaseOrderBase = reactive({
  id: -1,
  order_id: "",
  arrivalPlans: [
    {plan_quantity: Number.POSITIVE_INFINITY, plan_date: null}
  ]
});
const receiptData: PurchaseArrivalPlan = reactive({
  plan_quantity: Number.POSITIVE_INFINITY,
  plan_date: null
});
const rules = {
  order_id: [{required: true, message: "Please enter the order id", trigger: "blur"}],
  type: [{required: true, message: "Please enter the name", trigger: "blur"}],
  product_id: [{required: true, message: "Please select product", trigger: "blur"}],
  unit_price: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
  purchase_quantity: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
  plan_quantity: [{required: true, type: "number", min: 0, message: '正整数', trigger: 'blur'}],
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

const loadProducts = async () => {
  const response = await getProducts();
  if (response && response.status == 200) {
    products.value = response.data;
  } else {
    console.log("load product data failed.");
  }
};

const loadPurchaseArrivalPlan = async (row: any, expandRows: any) => {
  const response = await getPurchaseArrivalPlan(row.id);
  if (response && response.status == 200) {
    purchaseArrivalPlans.value = response.data;
  } else {
    console.log("load purchase arrival plan data failed.");
  }
}

const showAddPurchase = () => {
  addPurchaseTitle.value = "新增采购订单";
  addPurchaseVisible.value = true;
};

const resetAddPurchase = (formEl: FormInstance | undefined) => {
  addPurchaseVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const confirmPurchase = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const purchaseResp = await addPurchase(formData);
        const arrivalPlanResp = await addPurchaseArrivalPlan(formData.arrivalPlans);
        console.log(purchaseResp)
        console.log(arrivalPlanResp)
        if (purchaseResp && purchaseResp.status == 200 && arrivalPlanResp && arrivalPlanResp.status == 200) {
          ElMessage.success("新增采购订单成功");
        }
      } catch (err) {
        ElMessage.error("保存失败");
      }
      resetAddPurchase(formEl);
      await loadPurchases();
    } else {
      ElMessage.error("表单填写不正确");
      return false;
    }
  });
};

const addArrivalPlans = () => {
  formData.arrivalPlans.push({id: -1, purchase_id: -1, plan_quantity: Number.POSITIVE_INFINITY, plan_date: null});
}

const subArrivalPlans = (index: number) => {
  console.log(index)
  formData.arrivalPlans.splice(index, 1);
}

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

const showReceipt = () => {
  receiptTitle.value = "收货";
  receiptVisible.value = true;
};

const resetReceipt = (formEl: FormInstance | undefined) => {
  receiptVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const confirmReceipt = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const resp = await updatePurchaseArrivalPlan(receiptData.id, receiptData);
        if (resp && resp.status == 200) {
          ElMessage.success("确认收货成功");
        }
      } catch (err) {
        ElMessage.error("收货失败");
      }
      resetAddPurchase(formEl);
    } else {
      ElMessage.error("表单填写不正确");
      return false;
    }
  });
};

// Lifecycle hooks
onMounted(() => {
  loadPurchases();
  loadProducts();
});
</script>

<style scoped></style>