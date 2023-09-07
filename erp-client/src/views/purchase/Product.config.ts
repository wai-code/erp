export const ProductConfig = [
  // {key: 'id', label: '编号', width: '10%', type: 'text', options: []},
  {key: 'name', label: '名称', width: '10%', type: 'text', options: []},
  {key: 'model', label: '型号', width: '10%', type: 'text', options: []},
  {
    key: 'standard',
    label: '制造标准',
    width: '10%',
    type: 'select',
    options: [{key: "StandardA", label: "标准A"}, {key: "StandardB", label: "标准B"}]
  },
  {
    key: 'supplier_name',
    label: '供应商',
    width: '10%',
    type: 'select',
    options: [{key: "SupplierA", label: "供应商A"}, {key: "SupplierB", label: "供应商B"}]
  },
  {key: 'purchase_price', label: '采购价格', width: '10%', type: 'number', options: []},
  {key: 'sales_price', label: '销售指导价', width: '10%', type: 'number', options: []},
];