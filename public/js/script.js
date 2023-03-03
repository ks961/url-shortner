const floatingCanvasDiv = document.getElementById('floating-canvas');
const canvas = document.getElementById('canvas');
const canvasWrapper = document.getElementById('canvasWrapper');
const longUrl = document.getElementById("longUrl");
const downloader = document.getElementById("download");

async function copyTextClip() {

  const copyText = document.getElementById("rd-shrturl");
  
  text = copyText.value;
  
  if(!text || text === '') return;
  
  await navigator.clipboard.writeText(text);

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