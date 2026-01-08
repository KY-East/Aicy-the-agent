<template>
  <div class="task-list">
    <div class="task-list-header">
      <div class="task-list-title">{{ title }}</div>
      <div class="task-list-progress">
        {{ completedCount }} / {{ tasks.length }} 完成 ({{ progressPercent }}%)
      </div>
    </div>
    
    <div class="task-items">
      <div 
        v-for="(task, index) in tasks" 
        :key="index"
        class="task-item"
        :class="{ completed: taskStates[index] }"
      >
        <input
          type="checkbox"
          class="task-checkbox"
          :checked="taskStates[index]"
          @change="toggleTask(index)"
        />
        <div class="task-content" v-html="task"></div>
      </div>
    </div>
    
    <div class="task-actions">
      <button class="task-btn" @click="resetAll">
        🔄 重置全部
      </button>
      <button class="task-btn" @click="markAllComplete">
        ✅ 全部完成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '任务清单'
  },
  id: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  }
})

const taskStates = ref([])

// 从localStorage加载进度
const loadProgress = () => {
  const key = `mia-progress-${props.id}`
  const saved = localStorage.getItem(key)
  if (saved) {
    taskStates.value = JSON.parse(saved)
  } else {
    taskStates.value = new Array(props.tasks.length).fill(false)
  }
}

// 保存进度到localStorage
const saveProgress = () => {
  const key = `mia-progress-${props.id}`
  localStorage.setItem(key, JSON.stringify(taskStates.value))
  
  // 触发全局进度更新事件
  window.dispatchEvent(new CustomEvent('progress-updated'))
}

// 切换任务状态
const toggleTask = (index) => {
  taskStates.value[index] = !taskStates.value[index]
  saveProgress()
}

// 重置全部
const resetAll = () => {
  if (confirm('确定要重置所有任务吗？')) {
    taskStates.value = new Array(props.tasks.length).fill(false)
    saveProgress()
  }
}

// 标记全部完成
const markAllComplete = () => {
  taskStates.value = new Array(props.tasks.length).fill(true)
  saveProgress()
}

// 计算完成数量
const completedCount = computed(() => {
  return taskStates.value.filter(Boolean).length
})

// 计算完成百分比
const progressPercent = computed(() => {
  if (props.tasks.length === 0) return 0
  return Math.round((completedCount.value / props.tasks.length) * 100)
})

onMounted(() => {
  loadProgress()
})

// 监听任务列表变化
watch(() => props.tasks.length, (newLen) => {
  if (taskStates.value.length !== newLen) {
    loadProgress()
  }
})
</script>


