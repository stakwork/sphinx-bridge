
export function postMessage(data:{[k:string]:any}){
  const win = (window as any);

  if(win.sendToElectron) { // electron
    return win.sendToElectron('sphinx-bridge',data)
  }
  if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) {
    win.ReactNativeWebView.postMessage(JSON.stringify(data))
  }
  if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.webkit.messageHandlers.sphinx.postMessage(data)
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
    document.addEventListener('message', (e:any)=>{
      let final = {}
      try {final = JSON.parse(e.data)}catch(e){}
      func({data:final})
    })
  }
  if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.sphinxMessage = function(e:string) {
      let final = {}
      try {final = JSON.parse(e)}catch(e){}
      func({data:final})
    }
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
  if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.sphinxMessage = null
  }
  win.removeEventListener('message', func)
}