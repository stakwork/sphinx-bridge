
export function postMessage(data:{[k:string]:any}){
  const win = (window as any);

  if(win.sendToElectron) { // electron
    return win.sendToElectron('sphinx-bridge',data)
  } else if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) {
    win.ReactNativeWebView.postMessage(JSON.stringify(data))
  } else if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.webkit.messageHandlers.sphinx.postMessage(data)
  } else {
    win.parent.postMessage(data, '*') // browser iframe
  }
}

export function addEventer(func:any) {
  const win = (window as any);
  if(win.sendToElectron) {
    if(win.EE) win.EE.once('sphinx-bridge',func)
    return
  } else if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
    document.addEventListener('message', (e:any)=>{
      let final = {}
      try {final = JSON.parse(e.data)}catch(e){}
      func({data:final})
    })
  } else if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.sphinxMessage = function(e:string) {
      let final = {}
      try {final = JSON.parse(e)}catch(e){}
      func({data:final})
    }
  } else {
    win.addEventListener('message', func)
  }
}

export function removeEventer(func:any) {
  const win = (window as any);
  if(win.sendToElectron) {
    return // no need because EE.once
  } else if(win.ReactNativeWebView&&win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
    document.removeEventListener('message', func)
  } else if(win.webkit&&win.webkit.messageHandlers&&win.webkit.messageHandlers.sphinx&&win.webkit.messageHandlers.sphinx) {
    win.sphinxMessage = null
  } else {
    win.removeEventListener('message', func)
  }
}