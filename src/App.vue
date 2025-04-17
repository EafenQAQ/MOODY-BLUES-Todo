<template>
  <div class="container">
    <header class="app-header">

      <div id="title-container"
        class="flex items-center gap-2 hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
        @click="shakeTitle" :class="{ 'shake-animation': isShaking }">
        <img src="./assets/icon/icon.ico" width="40" alt="">
        <h1 id="app-title" class="zcool-kuaile-regular text-4xl">忧郁蓝调 Todo</h1>
      </div>
      <div class="timer-running" v-if="activeTimerCount > 0">
        <span class="timer-icon">⏱️</span>
        <span>{{ activeTimerCount }} 个任务正在计时</span>
      </div>
    </header>

    <todo-list ref="todoList" />

    <footer class="flex flex-col justify-center items-center">
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
import shakeSound from './assets/sound/shake-sound.mp3'

// 声明音频文件
const shakeAudio = new Audio(shakeSound)

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

// 控制抖动动画
const isShaking = ref(false)

const shakeTitle = () => {

  isShaking.value = true

  // 播放抖动音效
  shakeAudio.play()
  setTimeout(() => {
    isShaking.value = false
  }, 500) // 动画持续时间
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil:opsz,wght@10..72,100..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=ZCOOL+KuaiLe&display=swap');

.zcool-kuaile-regular {
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  font-style: normal;
}


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

/* 添加抖动动画 */
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }

  100% {
    transform: translateX(0);
  }
}

.shake-animation {
  animation: shake 0.5s ease-in-out;
}


</style>