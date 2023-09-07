export const PurchaseOrderConfig = [
  {
    key: 'type',
    label: '采购类型',
    width: '5%',
    type: 'select',
    options: [{key: "product", label: "产品"}, {key: "accessory", label: "配件"}]
  },
  {key: 'product_id', label: '产品ID', width: '5%', type: 'text', options: []},
  {key: 'unit_price', label: '单价', width: '5%', type: 'number', options: []},
  {key: 'purchase_quantity', label: '采购数量', width: '5%', type: 'number', options: []},
  {key: 'plan_quantity', label: '计划发货数量', width: '5%', type: 'number', options: []},
  {key: 'arrival_quantity', label: '实际到货数量', width: '5%', type: 'number', options: []},
  {key: 'loss_quantity', label: '损耗数量', width: '5%', type: 'number', options: []},
  // {key: 'pass_rate', label: '产品良率', width: '5%', type: 'number', options: []},
  {key: 'order_date', label: '下单日期', width: '5%', type: 'date', options: []},
  {key: 'plan_arrival_date', label: '计划最后到货日期', width: '5%', type: 'date', options: []},
  {key: 'last_arrival_date', label: '实际最后到货日期', width: '5%', type: 'date', options: []},
  {key: 'purchase_cycle', label: '采购周期', width: '5%', type: 'number', options: []},
  {key: 'shipping_method', label: '运输方式', width: '5%', type: 'text', options: []},
  {key: 'shipping_cost', label: '运费', width: '5%', type: 'number', options: []},
  {key: 'other_cost', label: '其他费用', width: '5%', type: 'number', options: []},
  {
    key: 'is_completed',
    label: '是否完成采购',
    width: '5%',
    type: 'radio',
    options: [{key: "yes", label: "是"}, {key: "no", label: "否"}]
  },
  {key: 'description', label: '描述', width: '5%', type: 'textarea', options: []},
  // {key: 'created_at', label: '创建时间', width: '5%', type: 'date', options: []},
  // {key: 'updated_at', label: '更新时间', width: '5%', type: 'date', options: []},
  // {key: 'operator', label: '操作人员', width: '5%', type: 'text', options: []}
];