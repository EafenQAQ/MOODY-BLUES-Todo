/**
 * 显示桌面通知
 * @param {string} title 通知标题
 * @param {string} body 通知内容
 */
export function showNotification(title, body) {
    // 检查浏览器是否支持通知
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }
  
    // 检查通知权限
    if (Notification.permission === "granted") {
      // 创建通知
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      // 请求权限
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }
  
  /**
   * 请求通知权限
   */
  export function requestNotificationPermission() {
    if (!("Notification" in window)) {
      return;
    }
  
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }