const $type = document.querySelector("#type");
const $result = document.querySelector("#result");

const cognitiveFunctions = {
  extraversion: {
    E: "extroverted",
    I: "introverted",
  },
  perceiving: {
    S: "sensing",
    N: "intuition",
  },
  judging: {
    T: "thinking",
    F: "feeling",
  },
  order: {
    J: "judging",
    P: "perceiving",
  },
};

function getJP(func) {
  if (Object.keys(cognitiveFunctions.judging).includes(func)) return "judging";
  if (Object.keys(cognitiveFunctions.perceiving).includes(func))
    return "perceiving";
  return "x";
}

function getOpposite(val, key) {
  if (!key || !val) return "x";
  const valU = val.toUpperCase();
  const values = cognitiveFunctions[key];
  if (!values) return "x";
  // Return the other key
  const oppositeKey = Object.keys(values).find((k) => k !== valU);
  return oppositeKey;
}

const mbtiTypesCognitiveFunctions = {
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INTJ: ["Ni", "Te", "Fi", "Se"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
};

function getCognitiveFunctions(mbtiType) {
  return mbtiTypesCognitiveFunctions[mbtiType.toUpperCase()];
}

function getMbtiType(cognitiveFunctions) {
  const mbtiType = Object.keys(mbtiTypesCognitiveFunctions).find((type) => {
    const functions = mbtiTypesCognitiveFunctions[type];
    return functions.every((fun) => cognitiveFunctions.includes(fun));
  });
  return mbtiType;
}

function fixInputValue($input, value, index) {
  let currentValue = getCognFuncValue($input);
  currentValue[index] = index === 0 ? value.toUpperCase() : value.toLowerCase();
  $input.value = currentValue.join("");
}

function assignCognitiveFunctions(mbtiType) {
  const cognitiveFunctions = getCognitiveFunctions(mbtiType);
  if (cognitiveFunctions) {
    cognitiveFunctions.forEach((fun, idx) => {
      $result.children[idx].value = fun;
    });
  }
}

function getCognFuncValue($input) {
  const value = ($input.value || "  ").split("");
  if (["e", "i"].includes(value[0])) {
    return ["X", value[0]];
  }
  return [value[0], value[1]];
}

$type.addEventListener("keyup", (e) => {
  assignCognitiveFunctions($type.value);
});

for (let i = 0; i < 4; i++) {
  $result.children[i].addEventListener("keyup", (e) => {
    const [func = "x", extraversion = "x"] = getCognFuncValue(e.target);
    const funcIsJP = getJP(func);
    const oppositeExtraversion = getOpposite(extraversion, "extraversion");

    for (let j = 0; j < 4; j++) {
      fixInputValue(
        $result.children[j],
        i % 2 === j % 2 ? extraversion : oppositeExtraversion,
        1
      );
    }

    if (i === 0 || i === 1) {
      const $alternateInput = $result.children[i === 0 ? 1 : 0];
      const alternate = getCognFuncValue($alternateInput);
      const first = getCognFuncValue($result.children[0]);
      const second = getCognFuncValue($result.children[1]);
      if (first && second) {
        const resultExtraversion = first[1] === "e" ? "E" : "I";
        const resPerceiving =
          funcIsJP === "perceiving"
            ? func
            : getJP(alternate[0]) === "perceiving"
            ? alternate[0]
            : "X";
        const resJudging =
          funcIsJP === "judging"
            ? func
            : getJP(alternate[0]) === "judging"
            ? alternate[0]
            : "X";
        const firstExtravertedFuncInStack =
          first[1] === "e" ? first[0] : second[0];
        const jp = getJP(firstExtravertedFuncInStack)
          .substr(0, 1)
          .toUpperCase();
        const type = [resultExtraversion, resPerceiving, resJudging, jp];
        $type.value = type.join("");

        assignCognitiveFunctions($type.value);
      }
    }
  });
}
