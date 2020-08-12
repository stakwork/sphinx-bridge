
export function postMessage(data:{[k:string]:any}){
  const win = (window as any);

  if(win.sendToElectron) { // electron
    return win.sendToElectron('sphinx-bridge',data)
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
  win.addEventListener('message', func)
}

export function removeEventer(func:any) {
  const win = (window as any);
  if(win.sendToElectron) {
    return // no need because EE.once
  }
  win.removeEventListener('message', func)
}