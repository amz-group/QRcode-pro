let currentQR = null;

const translations = {
  en: {
    generate: "Generate QR Code",
    scan: "Scan QR Code"
  },
  ku: {
    generate: "دروستکردنی QR",
    scan: "سکانکردنی QR"
  }
};

function changeLang(lang){
  document.getElementById("genTitle").innerText = translations[lang].generate;
  document.getElementById("scanTitle").innerText = translations[lang].scan;
}

function toggleMode(){
  document.body.classList.toggle("light-mode");
}

function login(){
  const user = document.getElementById("username").value;
  if(!user) return alert("Enter username");
  localStorage.setItem("qrUser", user);
  document.getElementById("loginBox").style.display="none";
}

function generateQR(){
  const container=document.getElementById("qrResult");
  container.innerHTML="";
  const text=document.getElementById("qrText").value;
  if(!text) return alert("Enter text");

  currentQR=new QRCode(container,{
    text:text,
    width:200,
    height:200
  });

  document.getElementById("downloadBtn").style.display="block";

  let history=JSON.parse(localStorage.getItem("qrHistory"))||[];
  history.push(text);
  localStorage.setItem("qrHistory",JSON.stringify(history));
  loadHistory();
}

function downloadQR(){
  const img=document.querySelector("#qrResult img");
  const link=document.createElement("a");
  link.href=img.src;
  link.download="qr-code.png";
  link.click();
}

function startScanner(){
  const scanner=new Html5Qrcode("reader");

  scanner.start(
    {facingMode:"environment"},
    {fps:10,qrbox:250},
    (decodedText)=>{
      document.getElementById("scanResult").innerText=decodedText;
      scanner.stop();
    }
  );
}

document.getElementById("fileInput").addEventListener("change",function(e){
  const file=e.target.files[0];
  if(!file) return;

  const scanner=new Html5Qrcode("reader");

  scanner.scanFile(file,true)
  .then(decodedText=>{
    document.getElementById("scanResult").innerText=decodedText;
  })
  .catch(()=>alert("Cannot scan image"));
});

function loadHistory(){
  const history=JSON.parse(localStorage.getItem("qrHistory"))||[];
  const list=document.getElementById("historyList");
  list.innerHTML="";
  history.forEach(item=>{
    const li=document.createElement("li");
    li.innerText=item;
    list.appendChild(li);
  });
}

window.onload=function(){
  if(localStorage.getItem("qrUser")){
    document.getElementById("loginBox").style.display="none";
  }
  loadHistory();
};
