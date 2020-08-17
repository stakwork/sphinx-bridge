
export function postMessage(data:{[k:string]:any}){
  const win = (window as any);

  if(win.sendToElectron) { // electron
    return win.sendToElectron('sphinx-bridge',data)
  }
  if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) {
    win.ReactNativeWebView.postMessage(JSON.stringify(data))
  }
  if(win.webkit.iosHandler) {

  }
  // browser iframe
  win.parent.postMessage(data, '*')
}

export function addEventer(func:any) {
  const win = (window as any);
  if(win.sendToElectron) {
    if(win.EE) win.EE.once('sphinx-bridge',func)
    return
  }
  if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
    document.addEventListener('message', func)
  }
  win.addEventListener('message', func)
}

export function removeEventer(func:any) {
  const win = (window as any);
  if(win.sendToElectron) {
    return // no need because EE.once
  }
  if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
    document.removeEventListener('message', func)
  }
  win.removeEventListener('message', func)
}