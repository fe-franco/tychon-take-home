export const validateInput = (value: string) => {
  if (isNaN(Number(value))) {
    console.log(`not a number`);
    return false;
  }

  if (value === ` `) {
    // console.log(`space`);
    return false;
  }
  if (value === `\n`) {
    console.log(`new line`);
    return false;
  }

  return true;
};

export const isTheLastCellInRow = (
  row: number,
  col: number,
  numbers: {
    value: number;
    used: boolean;
  }[][],
) => {
  return col === (numbers[row]?.length ?? 0) - 1;
};
