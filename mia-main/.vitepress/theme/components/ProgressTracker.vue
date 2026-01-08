<template>
  <div class="progress-tracker">
    <div class="progress-header">
      <h2 class="progress-title">🎯 学习进度追踪</h2>
      <p class="progress-subtitle">你的90天Web3交易之旅</p>
    </div>

    <div class="progress-stats">
      <div class="stat-card">
        <div class="stat-value">{{ totalProgress }}%</div>
        <div class="stat-label">总体进度</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ completedTasks }}</div>
        <div class="stat-label">已完成任务</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalTasks }}</div>
        <div class="stat-label">总任务数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ currentDay }}</div>
        <div class="stat-label">当前第几天</div>
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar-label">
        <span>整体完成度</span>
        <span>{{ completedTasks }} / {{ totalTasks }}</span>
      </div>
      <div class="progress-bar-bg">
        <div 
          class="progress-bar-fill" 
          :style="{ width: totalProgress + '%' }"
        >
          {{ totalProgress }}%
        </div>
      </div>
    </div>

    <div class="module-progress-list">
      <div 
        v-for="module in moduleProgress" 
        :key="module.id"
        class="module-progress-item"
      >
        <div class="module-name">
          {{ module.name }}
          <span style="float: right; font-size: 14px; color: var(--vp-c-text-2);">
            {{ module.completed }} / {{ module.total }}
          </span>
        </div>
        <div class="module-progress-bar">
          <div 
            class="module-progress-fill" 
            :style="{ width: module.percent + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn action-btn-primary" @click="exportProgress">
        📊 导出进度
      </button>
      <button class="action-btn action-btn-secondary" @click="resetProgress">
        🔄 重置进度
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const moduleProgress = ref([])
const currentDay = ref(1)

// 定义所有模块
const modules = [
  { id: 'day1', name: 'Day 1: 账户开通日' },
  { id: 'day2', name: 'Day 2: 入金与首次交易' },
  { id: 'day3', name: 'Day 3: K线入门' },
  { id: 'day4', name: 'Day 4: 钱包与链上操作' },
  { id: 'day5', name: 'Day 5: Meme币初体验' },
  { id: 'day6', name: 'Day 6: 模拟合约交易' },
  { id: 'day7', name: 'Day 7: 周复盘' },
  { id: 'week2', name: '第2周: 提升交易熟练度' },
  { id: 'week3', name: '第3周: 开始合约交易' },
  { id: 'week4', name: '第4周: 建立个人风格' },
  { id: 'month2-3', name: 'Day 31-90: IP建立季' }
]

// 计算每个模块的进度
const calculateModuleProgress = () => {
  const progress = []
  
  modules.forEach(module => {
    const key = `mia-progress-${module.id}`
    const saved = localStorage.getItem(key)
    
    if (saved) {
      const tasks = JSON.parse(saved)
      const completed = tasks.filter(Boolean).length
      const total = tasks.length
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0
      
      progress.push({
        id: module.id,
        name: module.name,
        completed,
        total,
        percent
      })
    }
  })
  
  moduleProgress.value = progress
}

// 计算总进度
const totalProgress = computed(() => {
  const total = moduleProgress.value.reduce((sum, m) => sum + m.total, 0)
  const completed = moduleProgress.value.reduce((sum, m) => sum + m.completed, 0)
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// 计算完成任务数
const completedTasks = computed(() => {
  return moduleProgress.value.reduce((sum, m) => sum + m.completed, 0)
})

// 计算总任务数
const totalTasks = computed(() => {
  return moduleProgress.value.reduce((sum, m) => sum + m.total, 0)
})

// 导出进度
const exportProgress = () => {
  const data = {
    date: new Date().toISOString(),
    currentDay: currentDay.value,
    totalProgress: totalProgress.value,
    completedTasks: completedTasks.value,
    totalTasks: totalTasks.value,
    modules: moduleProgress.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mia-progress-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 重置进度
const resetProgress = () => {
  if (confirm('确定要重置所有进度吗？此操作不可恢复！')) {
    modules.forEach(module => {
      localStorage.removeItem(`mia-progress-${module.id}`)
    })
    calculateModuleProgress()
    alert('进度已重置！')
  }
}

// 计算当前天数
const calculateCurrentDay = () => {
  const startDate = localStorage.getItem('mia-start-date')
  if (startDate) {
    const start = new Date(startDate)
    const now = new Date()
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    currentDay.value = Math.min(diff + 1, 90)
  } else {
    // 第一次使用，设置开始日期
    localStorage.setItem('mia-start-date', new Date().toISOString())
    currentDay.value = 1
  }
}

onMounted(() => {
  calculateModuleProgress()
  calculateCurrentDay()
  
  // 监听进度更新事件
  window.addEventListener('progress-updated', () => {
    calculateModuleProgress()
  })
})
</script>


