<template>
    <div id="timer-container"
        class="w-[8ch] box-border text-center max-sm:mr-2">
        <div id="timer" class="timer" :class="{ active: isActive }">
            {{ displayTime }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: [Date, Number, null],
        default: null
    },
    totalTime: {
        type: Number,
        default: 0
    }
})

const currentTime = ref(Date.now())
const intervalId = ref(null)

// 计算显示的时间
const displayTime = computed(() => {
    let timeToDisplay = props.totalTime

    if (props.isActive && props.startTime) {
        timeToDisplay += currentTime.value - new Date(props.startTime).getTime()
    }

    return formatTime(timeToDisplay)
})

// 格式化时间
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

// 启动或停止计时器
const updateTimerState = () => {
    if (props.isActive) {
        // 启动计时器
        intervalId.value = setInterval(() => {
            currentTime.value = Date.now()
        }, 1000)
    } else {
        // 停止计时器
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }
}

// 监视计时状态的变化
watch(() => props.isActive, (newVal) => {
    updateTimerState()
})

// 组件挂载时启动计时器
onMounted(() => {
    updateTimerState()
})

// 组件卸载时清理计时器
onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
})
</script>

<style scoped>
.timer {
    font-family: monospace;
    font-variant-numeric: tabular-nums;
    font-size: 16px;
    color: #333;
    white-space: nowrap;
    line-height: 1;

}

.timer.active {
    color: var(--color-primary);
}
</style>