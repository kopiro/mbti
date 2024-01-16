const $types = document.querySelector("#types");
const $typesdesc = document.querySelector("#typesdesc");
const $cfs = document.querySelector("#cfs");
const $cfsByIndex = new Array(8).fill(null);
const $cfsDescByIndex = new Array(4).fill(null);

const SCROLL_DURATION = 800;

const cognFuncNames = {
  Si: "Introverted Sensing",
  Se: "Extroverted Sensing",
  Ni: "Introverted Intuition",
  Ne: "Extroverted Intuition",
  Ti: "Introverted Thinking",
  Te: "Extroverted Thinking",
  Fi: "Introverted Feeling",
  Fe: "Extroverted Feeling",
};

const mbtiTypes = {
  ISTJ: {
    functions: ["Si", "Te", "Fi", "Ne", "Se", "Ti", "Fe", "Ni"],
    description:
      "Responsible and detail-oriented individuals who are dependable and thorough in their work. ISTJs value order and structure, often excelling in tasks that require precision and organization. They are practical, reliable, and loyal.",
  },
  ISFJ: {
    functions: ["Si", "Fe", "Ti", "Ne", "Se", "Fi", "Te", "Ni"],
    description:
      "Compassionate and nurturing individuals who are deeply attuned to the needs of others. ISFJs are often selfless and enjoy creating harmony in their surroundings. They are loyal, responsible, and dependable friends and family members.",
  },
  INFJ: {
    functions: ["Ni", "Fe", "Ti", "Se", "Ne", "Fi", "Te", "Si"],
    description:
      "Visionary and insightful individuals who are driven by their ideals and a desire to make a positive impact on the world. INFJs are often empathetic and intuitive, understanding the emotions and motivations of those around them. They are insightful, caring, and creative.",
  },
  INTJ: {
    functions: ["Ni", "Te", "Fi", "Se", "Ne", "Ti", "Fe", "Si"],
    description:
      "Strategic and forward-thinking individuals who enjoy conceptualizing and planning for the future. INTJs are often logical and analytical, seeking efficient and effective solutions to complex problems. They are independent, visionary, and goal-oriented.",
  },
  ISTP: {
    functions: ["Ti", "Se", "Ni", "Fe", "Te", "Si", "Ne", "Fi"],
    description:
      "Diligent workers who genuinely enjoy becoming experts at a craft or career. They tend to be calm and levelheaded in a crisis, quickly determining what needs to be done and effectively solving the problem. ISTPs are generally logical, kind, and tolerant.",
  },
  ISFP: {
    functions: ["Fi", "Se", "Ni", "Te", "Fe", "Si", "Ne", "Ti"],
    description:
      "Artistic and sensitive individuals who appreciate beauty and harmony. ISFPs are often reserved and quiet, enjoying the present moment and focusing on their personal values. They are compassionate, adaptable, and enjoy expressing themselves through creative outlets.",
  },
  INFP: {
    functions: ["Fi", "Ne", "Si", "Te", "Fe", "Ni", "Se", "Ti"],
    description:
      "Idealistic and creative individuals who are driven by their values and a desire to make a positive impact on the world. INFPs are often deep thinkers and feelers, valuing authenticity and authenticity in themselves and others. They are empathetic, supportive, and open-minded.",
  },
  INTP: {
    functions: ["Ti", "Ne", "Si", "Fe", "Te", "Ni", "Se", "Fi"],
    description:
      "Inquisitive and analytical individuals who enjoy exploring ideas and theories. INTPs are often logical and objective, seeking to understand the underlying principles of the world. They are innovative, independent, and enjoy problem-solving.",
  },
  ESTP: {
    functions: ["Se", "Ti", "Fe", "Ni", "Si", "Te", "Fi", "Ne"],
    description:
      "Energetic and action-oriented individuals who enjoy living in the moment. ESTPs are often adaptable and resourceful, thriving in dynamic and fast-paced environments. They are pragmatic, sociable, and enjoy taking risks.",
  },
  ESFP: {
    functions: ["Se", "Fi", "Te", "Ni", "Si", "Fe", "Ti", "Ne"],
    description:
      "Enthusiastic and spontaneous individuals who enjoy bringing joy and excitement to those around them. ESFPs are often outgoing and social, valuing experiences and relationships. They are expressive, playful, and live in the present moment.",
  },
  ENFP: {
    functions: ["Ne", "Fi", "Te", "Si", "Ni", "Fe", "Ti", "Se"],
    description:
      "Creative and imaginative individuals who are driven by their passions and a desire for personal growth. ENFPs are often enthusiastic and supportive, valuing authenticity and exploration. They are adaptable, optimistic, and enjoy connecting with others.",
  },
  ENTP: {
    functions: ["Ne", "Ti", "Fe", "Si", "Ni", "Te", "Fi", "Se"],
    description:
      "Inventive and curious individuals who enjoy exploring possibilities and challenging the status quo. ENTPs are often quick-witted and analytical, thriving in intellectually stimulating environments. They are innovative, independent, and enjoy debating ideas.",
  },
  ESTJ: {
    functions: ["Te", "Si", "Ne", "Fi", "Ti", "Se", "Ni", "Fe"],
    description:
      "Efficient and organized individuals who enjoy structure and order. ESTJs are often practical and reliable, excelling in tasks that require planning and implementation. They are responsible, decisive, and value tradition.",
  },
  ESFJ: {
    functions: ["Fe", "Si", "Ne", "Ti", "Fi", "Se", "Ni", "Te"],
    description:
      "Sociable and caring individuals who thrive in supportive and harmonious environments. ESFJs are often empathetic and nurturing, prioritizing the well-being of others. They are responsible, loyal, and enjoy building strong connections with people.",
  },
  ENFJ: {
    functions: ["Fe", "Ni", "Se", "Ti", "Fi", "Ne", "Si", "Te"],
    description:
      "Charismatic and compassionate individuals who are driven by a vision for a better future. ENFJs are often insightful and supportive, inspiring others to achieve their potential. They are empathetic, strategic, and enjoy making a positive impact on their communities.",
  },
  ENTJ: {
    functions: ["Te", "Ni", "Se", "Fi", "Ti", "Ne", "Si", "Fe"],
    description:
      "Strategic and decisive individuals who enjoy leading and organizing others. ENTJs are often ambitious and goal-oriented, seeking to implement their vision for success. They are efficient, confident, and value competence in themselves and others.",
  },
};

function calculateTypeFromStack(primary, secondary) {
  const [pFn, pExt] = primary.split("");
  const [sFn, sExt] = secondary.split("");
  const judgFn = ["T", "F"].includes(pFn) ? pFn : sFn;
  const percFn = ["S", "N"].includes(pFn) ? pFn : sFn;
  const jp =
    (pExt === "e" && getJP(pFn) === "J") || (sExt === "e" && getJP(sFn) === "J")
      ? "J"
      : "P";
  return [pExt, percFn, judgFn, jp].join("").toUpperCase();
}

function getJP(cf) {
  return ["T", "F"].includes(cf.substr(0, 1)) ? "J" : "P";
}

function createCognFunctions() {
  $cfs.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const $func = document.createElement("div");
    $func.setAttribute("draggable", true);
    $func.setAttribute("data-position", i);
    $func.classList.add("cf");

    const $spanwrap = document.createElement("div");
    $spanwrap.classList.add("cfspanwrap");

    const $span1 = document.createElement("span");
    $span1.setAttribute("data-cf-index", i);
    $span1.classList.add("cfa");
    $spanwrap.appendChild($span1);

    const $span2 = document.createElement("span");
    $span2.setAttribute("data-cf-index", i + 4);
    $span2.classList.add("cfb");
    $spanwrap.appendChild($span2);

    $func.appendChild($spanwrap);

    const $desc = document.createElement("div");
    $desc.classList.add("cfdesc");

    $func.appendChild($desc);

    $cfs.appendChild($func);

    $cfsByIndex[i] = $span1;
    $cfsByIndex[i + 4] = $span2;
    $cfsDescByIndex[i] = $desc;
  }
}

function createMBTITypes() {
  // Create a div for each type in $types
  let index = 0;
  for (const type of Object.keys(mbtiTypes)) {
    const $type = document.createElement("div");
    $type.setAttribute("data-type", type);
    $type.setAttribute("data-index", index++);
    $type.classList.add("type");
    $type.innerText = type;
    $types.appendChild($type);

    const $typedesc = document.createElement("div");
    $typedesc.setAttribute("data-type", type);
    $typedesc.classList.add("typedesc");
    $typedesc.innerText = mbtiTypes[type].description;
    $typesdesc.appendChild($typedesc);
  }
}

function getNodeTypeActive() {
  return (
    document.querySelector(".type.active") || document.querySelector(".type")
  );
}

function getNodeTypeFromString(typeStr) {
  return document.querySelector(`.type[data-type="${typeStr}"]`);
}

function changeActiveType($nextType) {
  if (!$nextType) return;

  const $activeType = getNodeTypeActive();
  if ($nextType === $activeType) return;

  const oldType = $activeType.dataset.type;
  const oldIndex = $activeType.dataset.index;

  const newType = $nextType.dataset.type;

  $activeType.classList.remove("active");
  $nextType.classList.add("active");

  // // Move y of $types to show active type
  $types.animate(
    {
      translate: [
        `0 ${-$activeType.offsetTop}px`,
        `0 ${-$nextType.offsetTop}px`,
      ],
    },
    {
      duration: SCROLL_DURATION,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  // Get typedesc of active type
  const scrollBy = (Number($nextType.dataset.index) > oldIndex ? -1 : 1) * 500;
  const $activeTypeDesc = document.querySelector(
    `.typedesc[data-type="${oldType}"]`
  );
  // Find new $typesdesc to show active type
  const $nextTypeDesc = document.querySelector(
    `.typedesc[data-type="${newType}"]`
  );
  $activeTypeDesc.animate(
    {
      translate: [`0 0`, `0 ${scrollBy}px`],
    },
    {
      duration: SCROLL_DURATION,
      easing: "ease-out",
    }
  );
  $nextTypeDesc.animate(
    {
      translate: [`0 ${-scrollBy}px`, `0 0`],
    },
    {
      duration: SCROLL_DURATION,
      easing: "ease-out",
    }
  );
  $activeTypeDesc.classList.remove("active");
  $nextTypeDesc.classList.add("active");

  const cognitiveFunctions = mbtiTypes[newType].functions;
  // Populate cognitive functions
  cognitiveFunctions.forEach((text, index) => {
    $cfsByIndex[index].innerText = text;

    if (index <= 3) {
      $cfsByIndex[index].parentElement.parentElement.setAttribute(
        "data-cf",
        text
      );
      $cfsByIndex[index].parentElement.parentElement.setAttribute(
        "data-jp",
        ["T", "F"].includes(text.substr(0, 1)) ? "J" : "P"
      );
      $cfsDescByIndex[index].innerText = cognFuncNames[text];
    }
  });
}

function onMouseWheel(e) {
  const $activeType = getNodeTypeActive();
  const $nextType =
    e.deltaY > 0
      ? $activeType.nextElementSibling
      : $activeType.previousElementSibling;
  changeActiveType($nextType);
}

// Change active type
document.body.addEventListener("mousewheel", onMouseWheel);

const keyPressesToCharIndex = {
  e: 0,
  i: 0,
  s: 1,
  n: 1,
  t: 2,
  f: 2,
  j: 3,
  p: 3,
};

$types.addEventListener("click", (e) => {
  if (e.target.dataset.type) {
    changeActiveType(e.target);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const $activeType = getNodeTypeActive();
    const $nextType =
      e.key === "ArrowDown"
        ? $activeType.nextElementSibling
        : $activeType.previousElementSibling;
    changeActiveType($nextType);
    return;
  }

  const changeTypeIndex = keyPressesToCharIndex[e.key];
  if (changeTypeIndex !== undefined) {
    const $activeType = getNodeTypeActive();
    const activeTypeStrArr = $activeType.dataset.type.split("");
    activeTypeStrArr[changeTypeIndex] = e.key.toUpperCase();
    const newTypeStr = activeTypeStrArr.join("");
    const $nextType = getNodeTypeFromString(newTypeStr);
    changeActiveType($nextType);
  }
});

const SWAP_DURATION = 500;

$cfs.addEventListener("click", (e) => {
  if (e.target.dataset.cf) {
    for (let i = 0; i < 4; i++) {
      // Animate the two cf
      const $leftCf = $cfs.children[i].querySelector(".cfspanwrap").children[0];
      const $rightCf =
        $cfs.children[i].querySelector(".cfspanwrap").children[1];

      const leftCfWidth = $leftCf.offsetWidth;

      // Clone leftCf, change text and modify class to .cfb
      const $leftCfClone = $leftCf.cloneNode(true);
      $leftCfClone.innerText = $rightCf.innerText;
      $leftCfClone.setAttribute("class", "cfa");
      $leftCfClone.setAttribute("data-cloned", true);
      $leftCfClone.style.opacity = 0;
      $leftCfClone.style.position = "absolute";
      $leftCf.parentElement.appendChild($leftCfClone);
      const widthOfLeftCf = $leftCfClone.offsetWidth;
      $leftCf.parentElement.removeChild($leftCfClone);

      $leftCf.style.position = "absolute";
      $leftCf.style.left = 0;

      $rightCf.style.position = "absolute";
      $rightCf.style.left = `${leftCfWidth + 20}px`;
      $leftCf.style.bottom = `22px`;

      $leftCf.setAttribute("class", "cfb");
      $rightCf.setAttribute("class", "cfa");

      const leftFinalValue = widthOfLeftCf + 20;
      $leftCf.animate(
        {
          translate: [`0 0`, `${leftFinalValue}px 0`],
        },
        {
          duration: SWAP_DURATION,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      const rightFinalValue = -(leftCfWidth + 20);
      $rightCf.animate(
        {
          translate: [`0 0`, `${rightFinalValue}px 0`],
        },
        {
          duration: SWAP_DURATION,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }

    setTimeout(() => {
      const newPrimary =
        document.querySelector(`[data-cf-index="4"]`).innerText;
      const newSecondary =
        document.querySelector(`[data-cf-index="5"]`).innerText;

      createCognFunctions();

      const newType = calculateTypeFromStack(newPrimary, newSecondary);
      const $nextType = getNodeTypeFromString(newType);

      changeActiveType($nextType);
    }, SWAP_DURATION);
  }
});

createMBTITypes();
createCognFunctions();

$cfs.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");

  const incomingCf = e.target.dataset.cf;
  const incomingIdx = Number(e.target.dataset.position);
  const incomingJp = getJP(incomingCf);

  // Set data JSON
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      incomingCf,
      incomingIdx,
      incomingJp,
    })
  );

  $cfs
    .querySelectorAll(`[draggable][data-jp="${incomingJp}"]`)
    .forEach(($scf) => {
      if ($scf === e.target) return;
      $scf.classList.add("droppable");
    });
});

$cfs.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
  Array.from($cfs.children).forEach(($scf) => {
    $scf.classList.remove("droppable");
    $scf.classList.remove("over");
  });
});

$cfs.addEventListener("dragenter", (e) => {
  if (!e.target.classList.contains("droppable")) return;
  e.target.classList.add("over");
});

$cfs.addEventListener("dragleave", (e) => {
  if (!e.target.classList.contains("droppable")) return;
  e.target.classList.remove("over");
});

$cfs.addEventListener("dragover", (e) => {
  e.preventDefault();
});

$cfs.addEventListener("drop", (e) => {
  e.stopPropagation(); // stops the browser from redirecting.
  if (!e.target.classList.contains("droppable")) return;

  const data = JSON.parse(e.dataTransfer.getData("text/plain"));
  const { incomingCf, incomingIdx, incomingJp } = data;

  const dropIndex = Number(e.target.dataset.position);

  const currentType = [
    $cfsByIndex[0].innerText,
    $cfsByIndex[1].innerText,
    $cfsByIndex[2].innerText,
    $cfsByIndex[3].innerText,
  ];

  console.log("currentType :>> ", currentType);

  currentType[dropIndex] = incomingCf;
  currentType[incomingIdx] = e.target.dataset.cf;

  const newType = calculateTypeFromStack(currentType[0], currentType[1]);
  const $nextType = getNodeTypeFromString(newType);
  changeActiveType($nextType);
});

// On Load - random type
const $randomType =
  $types.children[Math.floor(Math.random() * $types.children.length)];
changeActiveType($randomType);
