import type { User, Role, Permission, RouteConfig, FormSchema } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

const now = Date.now()

const hashPassword = (pwd: string) => bcrypt.hashSync(pwd, 10)

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    username: 'admin',
    password: hashPassword('admin123'),
    name: '超级管理员',
    email: 'admin@company.com',
    roleIds: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: uuidv4(),
    username: 'manager',
    password: hashPassword('manager123'),
    name: '业务经理',
    email: 'manager@company.com',
    roleIds: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: uuidv4(),
    username: 'employee',
    password: hashPassword('employee123'),
    name: '普通员工',
    email: 'employee@company.com',
    roleIds: [],
    createdAt: now,
    updatedAt: now
  }
]

mockUsers[0].roleIds = []
mockUsers[1].roleIds = []
mockUsers[2].roleIds = []

export const mockPermissions: Permission[] = [
  { id: uuidv4(), code: 'user:read', name: '查看用户', resource: 'user', action: 'read', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'user:write', name: '编辑用户', resource: 'user', action: 'write', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'user:delete', name: '删除用户', resource: 'user', action: 'delete', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'form:read', name: '查看表单', resource: 'form', action: 'read', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'form:write', name: '编辑表单', resource: 'form', action: 'write', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'form:delete', name: '删除表单', resource: 'form', action: 'delete', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'role:read', name: '查看角色', resource: 'role', action: 'read', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'role:write', name: '编辑角色', resource: 'role', action: 'write', createdAt: now, updatedAt: now },
  { id: uuidv4(), code: 'system:admin', name: '系统管理', resource: 'system', action: 'admin', createdAt: now, updatedAt: now }
]

export const mockRoles: Role[] = [
  {
    id: uuidv4(),
    code: 'super_admin',
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissionIds: mockPermissions.map(p => p.id),
    createdAt: now,
    updatedAt: now
  },
  {
    id: uuidv4(),
    code: 'department_manager',
    name: '部门经理',
    description: '管理本部门业务，可配置表单',
    permissionIds: mockPermissions.filter(p => ['user:read', 'form:read', 'form:write', 'role:read'].includes(p.code)).map(p => p.id),
    createdAt: now,
    updatedAt: now
  },
  {
    id: uuidv4(),
    code: 'employee',
    name: '普通员工',
    description: '查看和填写表单',
    permissionIds: mockPermissions.filter(p => ['form:read'].includes(p.code)).map(p => p.id),
    createdAt: now,
    updatedAt: now
  }
]

mockUsers[0].roleIds = [mockRoles[0].id]
mockUsers[1].roleIds = [mockRoles[1].id]
mockUsers[2].roleIds = [mockRoles[2].id]

export const mockRoutes: RouteConfig[] = [
  {
    id: uuidv4(),
    path: '/dashboard',
    name: 'Dashboard',
    component: 'DashboardView',
    meta: { title: '工作台', icon: 'dashboard', roles: ['super_admin', 'department_manager', 'employee'], layout: 'DefaultLayout' },
    children: []
  },
  {
    id: uuidv4(),
    path: '/user-management',
    name: 'UserManagement',
    component: 'UserManagementView',
    meta: { title: '用户管理', icon: 'user', roles: ['super_admin'], layout: 'DefaultLayout' },
    children: []
  },
  {
    id: uuidv4(),
    path: '/role-management',
    name: 'RoleManagement',
    component: 'RoleManagementView',
    meta: { title: '角色权限', icon: 'shield', roles: ['super_admin', 'department_manager'], layout: 'DefaultLayout' },
    children: []
  },
  {
    id: uuidv4(),
    path: '/form-builder',
    name: 'FormBuilder',
    component: 'FormBuilderView',
    meta: { title: '表单构造器', icon: 'edit', roles: ['super_admin', 'department_manager'], layout: 'DefaultLayout' },
    children: []
  },
  {
    id: uuidv4(),
    path: '/form-render',
    name: 'FormRender',
    component: 'FormRenderView',
    meta: { title: '表单中心', icon: 'form', roles: ['super_admin', 'department_manager', 'employee'], layout: 'DefaultLayout' },
    children: []
  },
  {
    id: uuidv4(),
    path: '/form-render/:id',
    name: 'FormRenderDetail',
    component: 'FormRenderDetailView',
    meta: { title: '表单详情', icon: 'form', roles: ['super_admin', 'department_manager', 'employee'], layout: 'DefaultLayout', keepAlive: false },
    children: []
  },
  {
    id: uuidv4(),
    path: '/system-log',
    name: 'SystemLog',
    component: 'SystemLogView',
    meta: { title: '系统日志', icon: 'log', roles: ['super_admin'], layout: 'DefaultLayout' },
    children: []
  }
]

export const mockFormSchemas: FormSchema[] = [
  {
    id: 'form_leave',
    name: '请假申请表单',
    description: '员工请假申请',
    roles: ['super_admin', 'department_manager', 'employee'],
    layout: { columns: 2, labelWidth: 120 },
    submitUrl: '/api/form/submit/leave',
    fields: [
      { key: 'applicant', type: 'input', label: '申请人', required: true, placeholder: '请输入申请人姓名', defaultValue: '' },
      { key: 'department', type: 'select', label: '所属部门', required: true, options: [{ label: '技术部', value: 'tech' }, { label: '市场部', value: 'marketing' }, { label: '人事部', value: 'hr' }], defaultValue: 'tech' },
      { key: 'leaveType', type: 'radio', label: '请假类型', required: true, options: [{ label: '年假', value: 'annual' }, { label: '病假', value: 'sick' }, { label: '事假', value: 'personal' }], defaultValue: 'annual' },
      { key: 'startDate', type: 'date', label: '开始日期', required: true, defaultValue: '' },
      { key: 'endDate', type: 'date', label: '结束日期', required: true, defaultValue: '' },
      { key: 'days', type: 'number', label: '请假天数', required: true, props: { min: 0.5, step: 0.5 }, defaultValue: 1 },
      { key: 'reason', type: 'textarea', label: '请假事由', required: true, placeholder: '请详细说明请假原因', props: { rows: 4 } },
      { key: 'urgent', type: 'switch', label: '是否紧急', defaultValue: false },
      { key: 'attachments', type: 'upload', label: '相关附件' },
      { key: 'cc', type: 'checkbox', label: '抄送人员', options: [{ label: '直接上级', value: 'leader' }, { label: 'HR', value: 'hr' }, { label: '部门全员', value: 'all' }], defaultValue: ['leader'] }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'form_expense',
    name: '费用报销表单',
    description: '日常费用报销申请',
    roles: ['super_admin', 'department_manager', 'employee'],
    layout: { columns: 2, labelWidth: 120 },
    submitUrl: '/api/form/submit/expense',
    fields: [
      { key: 'applicant', type: 'input', label: '报销人', required: true, defaultValue: '' },
      { key: 'expenseDate', type: 'date', label: '费用日期', required: true, defaultValue: '' },
      { key: 'category', type: 'select', label: '费用类别', required: true, options: [{ label: '差旅费', value: 'travel' }, { label: '招待费', value: 'entertainment' }, { label: '办公用品', value: 'office' }, { label: '通讯费', value: 'communication' }], defaultValue: 'travel' },
      { key: 'amount', type: 'number', label: '金额（元）', required: true, props: { min: 0, precision: 2 }, defaultValue: 0 },
      { key: 'description', type: 'textarea', label: '费用说明', required: true, placeholder: '请说明费用产生的原因', props: { rows: 3 } },
      { key: 'invoice', type: 'upload', label: '发票附件', required: true },
      { key: 'payMethod', type: 'radio', label: '支付方式', options: [{ label: '对公转账', value: 'bank' }, { label: '现金报销', value: 'cash' }], defaultValue: 'bank' }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'form_purchase',
    name: '采购申请单',
    description: '办公用品及设备采购申请',
    roles: ['super_admin', 'department_manager'],
    layout: { columns: 2, labelWidth: 120 },
    submitUrl: '/api/form/submit/purchase',
    fields: [
      { key: 'applicant', type: 'input', label: '申请人', required: true, defaultValue: '' },
      { key: 'itemName', type: 'input', label: '物品名称', required: true, defaultValue: '' },
      { key: 'quantity', type: 'number', label: '数量', required: true, props: { min: 1, step: 1 }, defaultValue: 1 },
      { key: 'estimatedPrice', type: 'number', label: '预估单价（元）', required: true, props: { min: 0, precision: 2 }, defaultValue: 0 },
      { key: 'supplier', type: 'input', label: '推荐供应商', placeholder: '选填' },
      { key: 'reason', type: 'textarea', label: '采购理由', required: true, placeholder: '请说明采购用途', props: { rows: 4 } },
      { key: 'urgent', type: 'switch', label: '加急处理', defaultValue: false }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'form_cascade',
    name: '省市级联示例表单',
    description: '演示下拉框联动（选省份后城市跟随变化）',
    roles: ['super_admin', 'department_manager', 'employee'],
    layout: { columns: 2, labelWidth: 120 },
    submitUrl: '/api/form/submit/cascade',
    fields: [
      {
        key: 'province',
        type: 'select',
        label: '省份',
        required: true,
        options: [
          { label: '广东省', value: 'gd' },
          { label: '浙江省', value: 'zj' },
          { label: '江苏省', value: 'js' }
        ],
        defaultValue: 'gd'
      },
      {
        key: 'city',
        type: 'select',
        label: '城市',
        required: true,
        dependsOn: 'province',
        optionsMap: {
          gd: [
            { label: '广州市', value: 'gz' },
            { label: '深圳市', value: 'sz' },
            { label: '珠海市', value: 'zh' }
          ],
          zj: [
            { label: '杭州市', value: 'hz' },
            { label: '宁波市', value: 'nb' },
            { label: '温州市', value: 'wz' }
          ],
          js: [
            { label: '南京市', value: 'nj' },
            { label: '苏州市', value: 'su' },
            { label: '无锡市', value: 'wx' }
          ]
        }
      },
      { key: 'address', type: 'input', label: '详细地址', placeholder: '请输入详细地址', defaultValue: '' }
    ],
    createdAt: now,
    updatedAt: now
  }
]
