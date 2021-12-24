fetch(
  "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6e4d3d3-c52c-4ea8-b665-968a3b17c5ea/bank.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211224T041320Z&X-Amz-Expires=86400&X-Amz-Signature=ea8a68c6b779a6bbfd81b82536d1c880aa610814f0854c8709a2958cd9f8bbaa&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22bank.json%22&x-id=GetObject"
)
  .then((res) => res.json())
  .then((obj) => {
    dateTest(obj.bankList);
  });

var todayDate;

function dateTest(obj) {
  todayDate = parseInt(obj[obj.length - 1].date.replace(/\-/g, ""));

  let standardDay = 0;
  let expendSum = 0;
  let index = 0;
  let expendArr = [];

  for (let i = obj.length - 1; i >= 0; i--) {
    if (standardDay !== parseInt(obj[i].date.replace(/\-/g, ""))) {
      expendArr.push(expendSum.toLocaleString() + "원 지출");

      standardDay = parseInt(obj[i].date.replace(/\-/g, ""));
      expendSum = 0;
    }

    if (obj[i].income == "out") {
      expendSum += obj[i].price;
    }
  }

  standardDay = 0;

  for (let i = obj.length - 1; i >= 0; i--) {
    //기준날짜가 다를 때마다(날짜가 바뀔 때마다) div랑 ul 생성하고, 기준날짜 변경
    if (standardDay !== obj[i].date) {
      //div(>span, span)생성
      const divElem = document.createElement("div");
      document.querySelector(".daily-usage").appendChild(divElem);

      const dateSpanElem = document.createElement("span");
      dateSpanElem.textContent = getNumberOfDays(obj[i].date);
      dateSpanElem.classList.add("date");
      divElem.appendChild(dateSpanElem);

      const amountSpanElem = document.createElement("span");
      amountSpanElem.textContent = expendArr[++index];
      amountSpanElem.classList.add("amount");
      divElem.appendChild(amountSpanElem);

      //ul 생성
      var ulElem = document.createElement("ul");
      document.querySelector(".daily-usage").appendChild(ulElem);

      //기준 날짜 변경
      standardDay = obj[i].date;
      expendSum = 0;
    }

    //모든 객체마다 li는 생성해야 하니
    //li(>span, span) 생성 처리
    const liElem = document.createElement("li");
    const titleSpanElem = document.createElement("span");
    titleSpanElem.classList = "title";
    const costSpanElem = document.createElement("span");
    costSpanElem.classList = "cost";

    //cost 처리
    titleSpanElem.textContent = obj[i].history;
    if (obj[i].income == "in") {
      costSpanElem.textContent = "+" + obj[i].price.toLocaleString();
      costSpanElem.classList.add("in");
    } else {
      expendSum += obj[i].price;
      costSpanElem.textContent = obj[i].price.toLocaleString();
    }

    //요소 붙이는 작업
    liElem.appendChild(titleSpanElem);
    liElem.appendChild(costSpanElem);

    ulElem.appendChild(liElem);
  }
}

//일수계산 함수
function getNumberOfDays(date) {
  date = todayDate - parseInt(date.replace(/\-/g, ""));

  if (date > 70) date -= 70;

  if (date == 0) {
    return "오늘";
  } else if (date == 1) {
    return "어제";
  } else {
    return date + "일 전";
  }
}

// function upDownScrollbar() {
//   document.querySelector(".usage-history").classList.add("up-scroll");
// }

const usageHistoryElem = document.querySelector(".usage-history");
const pageScrollBar = document.querySelector(".updown-scrollbar");
pageScrollBar.addEventListener("touchmove", (e) => {
  e.preventDefault();

  console.log(e.touches[0].clientY);

  if (e.touches[0].clientY > 300) {
    usageHistoryElem.style.top = "352px";
  } else if (e.touches[0].clientY <= 300) {
    usageHistoryElem.style.top = "99px";
  }
});
