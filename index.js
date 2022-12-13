const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
//canvas3 ↑

const eraserBtn = document.getElementById("eraser-btn");
const destoryBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
); //배열로 설정해야 forEach 적용 가능

const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width"); //선 굵기
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value; //선 굵기
ctx.lineCap = "round"; //선의 형태
//마우스 클릭할 때 선 그리고 떼면 선 그만 그리기+선 굵기 적용
let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  //이거 없으면 브러쉬 굵기 바뀌면 이미 그려진 선의 굵기도 따라서 업데이트 됨.
  //경로를 새로 지정해서 선을 그리는 게 끝나면 새로운 경로를 지정해야 함.
  ctx.moveTo(event.offsetX, event.offsetY);
}
function onMouseDown() {
  isPainting = true;
}

function onMouseUp() {
  isPainting = false;
}

function onLineWidthChange(event) {
  // console.log(event.target.value);//굵기의 값 가져오기
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, 800, 800);
  }
}

function onDestoryClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 800, 800);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

//canvas3
function onFileChange(event) {
  const file = event.target.files[0];
  //js를 통해 입력한 파일을 브라우저를 위한 url 추출
  //브라우저가 자신의 메모리에 있는 파일을 url을 통해 드러냄.
  //다른 웹에선 권한이 없으니 열리진 않음.
  const url = URL.createObjectURL(file);
  const image = new Image(); //==<img src=""></img>
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, 800, 800); //200,200은 사진 시작 좌표
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save(); //ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장
    ctx.lineWidth = 1; //text기본크기를 수정하면 브러쉬도 같이 수정됨
    ctx.font = "68px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    //offset은 마우스가 클릭한 내부 좌표
    //stroke는 테두리만 있는 글자, fill은 채워진 글자
    ctx.restore();
    //restore은 원래 저장된 스타일로 돌아가기
    //save와 restore사이는 저장 안 됨.->내부 수정 삽가능
  }
}

function onSaveClick() {
  const url = canvas.toDataURL(); //인코딩 된 이미지 url로 받기
  //가짜 링크를 만들어 이미지 다운
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png"; //배경은 지워지고 그림만 추출
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destoryBtn.addEventListener("click", onDestoryClick);
eraserBtn.addEventListener("click", onEraserClick);
//canvas3
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
