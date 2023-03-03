const floatingCanvasDiv = document.getElementById('floating-canvas');
const canvas = document.getElementById('canvas');
const canvasWrapper = document.getElementById('canvasWrapper');
const longUrl = document.getElementById("longUrl");
const shortUrl = document.getElementById("rd-shrturl");
const downloader = document.getElementById("download");

function unsecureCopyToClipboard() {
  shortUrl.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}


async function copyTextClip() {
  
  text = shortUrl.value;
  
  if(text == undefined || !text || text === '') return;
  
  if(window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    unsecureCopyToClipboard();
  }

  document.getElementById("cpy-succ").style.display = "block";
}


function handleQRcodeGen() {
  const text = longUrl.value;

  QRCode.toCanvas(canvas, text, function (error) {
    if (error) console.error(error);
    canvasWrapper.classList.add("active");
    floatingCanvasDiv.classList.add("active");
  });
  
}

function download() {
  const image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
  downloader.setAttribute("href", image);
}


floatingCanvasDiv.addEventListener('click', ()=> {
  longUrl.value = '';
  canvas.getContext('2d').reset();
  canvasWrapper.classList.remove("active");
  floatingCanvasDiv.classList.remove("active");
});