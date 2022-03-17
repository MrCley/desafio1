let n = prompt('Adicione o valor de N\n para uma melhor experiencia, escolha um valor entre:\n 5 - Minimalista\n e\n 100 - Se sua tela for bem grande')

/*
    Functions auxiliares
    Para identificar onde desenhar, identificar o frame (bordas e diagonais) da ampulheta,
    se o char se encontra no compartimento da areia, e o delay para simular passagem do tempo.
*/

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
const isUpperBorder = (x) => {
  return x === 0;
};
const isLowerBorder = (x) => {
  return x === n - 1;
};
const isLeftBorder = (y) => {
  return y === 0;
};
const isRightBorder = (y) => {
  return y === n - 1;
};
const isDiagonal = (x, y) => {
  return x === y; // diagonal do canto superior esquero até inferior direito
};
const isReversedDiagonal = (x, y) => {
  return x === n - 1 - y; // diagonal do canto inferior esquero até superior direito
};
const isFrame = (x, y) => {
  return (
    isUpperBorder(x) ||
    isLowerBorder(x) ||
    isLeftBorder(y) ||
    isRightBorder(y) ||
    isDiagonal(x, y) ||
    isReversedDiagonal(x, y)
  );
};
const isSandGrain = (x, y) => {
  return x < y && x < n - 1 - y && !isUpperBorder(x);
};

let sandGrainCount = 0;

const shouldDrawOnCell = (x, y) => {
  if (isFrame(x, y)) {
    return true;
  }
  if (isSandGrain(x, y)) {
    sandGrainCount += 1;
    return true;
  }
  return false;
};

/*
    Processando o desenho

    é possível remover 1 for loop da iteração da matriz da seguinte maneira:
    for (let i = 0; i < n * n; i++) {
    let x = i % n;   e atualizar o y na ultima coluna
    porém o tempo de processamento seria o mesmo já que O(n*n) = O(nˆ2),
    então optei por usar os 2 for loops para melhorar a clareza do código
*/

let remainingSandGrainCount = 0;
let draw = [];

// cria uma matriz representanto a ampulheta (bordas, diagonais, e areia inicial preenchida)
const buildHourglass = () => {
  for (let i = 0; i < n; i++) {
    draw.push([]);
    for (let j = 0; j < n; j++) {
      if (shouldDrawOnCell(i, j)) draw[i].push("#");
      else draw[i].push(" ");
    }
    draw[i].push("\n");
  }
  remainingSandGrainCount = sandGrainCount;
};

/*
    executa um passo de passagem de tempo na ampulheta,
    simbolizando a passagem de um grão (char) de areia.
    A idéia é identificar o primeiro grão de areia do compartimento supertior
    e remove-lo. Então adicionamos o grão (#) na mesma posição do compartimento inferior
    quando invertemos o index em "draw[n - 1 - ii][jj] = "#";"
*/
const passSandGrain = () => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (
        isSandGrain(i, j) &&
        remainingSandGrainCount > 0 &&
        draw[i][j] === "#"
      ) {
        draw[i][j] = " ";
        draw[n - 1 - i][j] = "#";
        remainingSandGrainCount -= 1;
        return;
      }
    }
  }
};

/*
  concatena a matriz em uma string para facilitar output
*/
const buildDisplayString = (drawMatrix) => {
  let str = "";
  for (let drawLine of drawMatrix) {
    for (let drawChar of drawLine) {
      str += drawChar;
    }
  }
  return str;
};

/*
  mostra a ampulheta com a passagem do tempo
*/
const display = async () => {
  for (let i = 0; i <= sandGrainCount; i++) {
    console.clear();
    console.log(buildDisplayString(draw));
    passSandGrain();
    await delay(500);
  }
};

buildHourglass();
display();
