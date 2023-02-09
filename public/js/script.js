async function copyTextClip() {

  var copyText = document.getElementById("rd-shrturl");

  text = copyText.value;

  if(!text || text === '') return;

  await navigator.clipboard.writeText(text);

  document.getElementById("cpy-succ").style.display = "block";
}
