<template>
  <div class="container">
    <header class="app-header">

      <div class="flex items-center gap-2">
        <img src="./assets/icon/icon.ico" width="40" alt="">
        <h1 class="text-3xl font-semibold">忧郁蓝调 Todo</h1>

      </div>
      <div class="timer-running" v-if="activeTimerCount > 0">
        <span class="timer-icon">⏱️</span>
        <span>{{ activeTimerCount }} 个任务正在计时</span>
      </div>
    </header>

    <todo-list ref="todoList" />

    <footer class="app-footer">
      <p>忧郁蓝调 Todo List 应用 - {{ currentYear }}</p>
      <small>
        Copyright © 2025-{{ currentYear }} @智能的Eafen. All Rights Reserved.
      </small>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TodoList from './components/TodoList.vue'

// 获取TodoList组件的引用
const todoList = ref(null)

// 计算当前年份
const currentYear = computed(() => new Date().getFullYear())

// 计算当前正在计时的任务数量
const activeTimerCount = ref(0)

// 定期检查正在计时的任务数量
onMounted(() => {
  setInterval(() => {
    // 确保todoList组件已加载
    if (todoList.value && todoList.value.todos) {
      activeTimerCount.value = todoList.value.todos.filter(t => t.isTracking).length
    }
  }, 1000)
})
</script>

<style>
:root {
  --primary-color: #8d64e1;
  --hover-color: #764bcb;
  --danger-color: #f44336;
  --text-color: #333;
  --light-bg: #f9f9f9;
  --border-color: #ddd;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color);
}

.app-header h1 {
  color: var(--primary-color);
  margin: 0;
}

.timer-running {
  background-color: #ffeb3b;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #333;
}

.timer-icon {
  margin-right: 5px;
  font-size: 18px;
}

.app-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: #666;
}
</style>