export default function setTitle (title) {
  document.title = title
  if (/weixin/i.test(navigator.userAgent)) {
    let iframe = document.createElement('iframe')
    iframe.src = '/favicon.ico'
    iframe.style.display = 'none'
    iframe.onload = function () {
      requestAnimationFrame(function () {
        iframe.remove()
      })
    }
    document.body.appendChild(iframe)
  }
}
