<template>
    <div class="stats-container">
        <h3 class="mb-3">任务统计</h3>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{{ totalTasks }}</div>
                <div class="stat-label">总任务数</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">{{ completedTasks }}</div>
                <div class="stat-label">已完成</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">{{ activeTasks }}</div>
                <div class="stat-label">进行中</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">{{ currentlyTracking }}</div>
                <div class="stat-label">正在计时</div>
            </div>
        </div>

        <div class="time-stats">
            <h4>总计时间</h4>
            <div class="total-time">{{ formatTime(totalTimeSpent) }}</div>
        </div>

        <div v-if="recentTasks.length > 0" class="recent-tasks">
            <h4>最近完成的任务</h4>
            <ul>
                <li v-for="task in recentTasks" :key="task.id">
                    <span class="task-name">{{ task.text }}</span>
                    <span class="task-time">{{ formatTime(task.totalTime) }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    todos: {
        type: Array,
        required: true
    }
})

// 计算总任务数
const totalTasks = computed(() => props.todos.length)

// 计算已完成任务数
const completedTasks = computed(() => props.todos.filter(t => t.completed).length)

// 计算进行中任务数
const activeTasks = computed(() => props.todos.filter(t => !t.completed).length)

// 计算正在计时的任务数
const currentlyTracking = computed(() => props.todos.filter(t => t.isTracking).length)

// 计算总计时间
const totalTimeSpent = computed(() => {
    return props.todos.reduce((total, todo) => {
        let time = todo.totalTime

        // 如果正在计时，加上当前计时时间
        if (todo.isTracking && todo.startTime) {
            time += Date.now() - new Date(todo.startTime).getTime()
        }

        return total + time
    }, 0)
})

// 获取最近完成的任务（最多5个）
const recentTasks = computed(() => {
    return props.todos
        .filter(t => t.completed && t.totalTime > 0)
        .sort((a, b) => b.timeRecords[b.timeRecords.length - 1]?.end - a.timeRecords[a.timeRecords.length - 1]?.end)
        .slice(0, 5)
})

// 格式化时间显示
const formatTime = (ms) => {
    if (!ms) return '00:00:00'

    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .join(':')
}
</script>

<style scoped>
.stats-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-container h3 {
    margin-top: 0;
    color: #333;
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.stat-card {
    background-color: white;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
}

.stat-label {
    margin-top: 5px;
    color: #666;
    font-size: 14px;
}

.time-stats {
    background-color: white;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.time-stats h4 {
    margin-top: 0;
    color: #333;
}

.total-time {
    font-size: 28px;
    font-family: monospace;
    color: var(--primary-color);
    font-weight: bold;
}

.recent-tasks {
    background-color: white;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-tasks h4 {
    margin-top: 0;
    color: #333;
}

.recent-tasks ul {
    list-style: none;
    padding: 0;
}

.recent-tasks li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.task-name {
    flex: 1;
}

.task-time {
    font-family: monospace;
    color: var(--primary-color);
}
</style>