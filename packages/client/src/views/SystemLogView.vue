<template>
  <el-card>
    <template #header>
      <span class="card-header">系统操作日志</span>
    </template>
    <el-table :data="logs" stripe>
      <el-table-column label="时间" width="200">
        <template #default="{ row }">{{ row.time }}</template>
      </el-table-column>
      <el-table-column prop="user" label="操作人" width="140" />
      <el-table-column prop="action" label="操作" width="160" />
      <el-table-column prop="target" label="目标对象" width="180" />
      <el-table-column prop="ip" label="IP 地址" width="140" />
      <el-table-column prop="detail" label="详情" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface LogItem {
  time: string
  user: string
  action: string
  target: string
  ip: string
  detail: string
}

const logs = ref<LogItem[]>([])

function generateMockLogs(): LogItem[] {
  const users = ['admin', 'manager', 'employee']
  const actions = ['登录系统', '退出系统', '查看表单', '提交表单', '创建表单', '修改表单', '删除表单', '修改角色权限']
  const targets = ['系统', '请假申请表单', '费用报销表单', '采购申请单', '角色权限配置', '用户管理']
  const details = [
    '操作成功',
    '表单数据校验通过',
    '权限校验通过',
    '数据已更新',
    '新增记录成功',
    '删除操作完成'
  ]
  const result: LogItem[] = []
  const now = Date.now()
  for (let i = 0; i < 20; i++) {
    result.push({
      time: new Date(now - i * 3600 * 1000 * Math.random() * 8).toLocaleString(),
      user: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      detail: details[Math.floor(Math.random() * details.length)]
    })
  }
  return result
}

onMounted(() => {
  logs.value = generateMockLogs()
})
</script>

<style scoped>
.card-header {
  font-weight: 600;
}
</style>
