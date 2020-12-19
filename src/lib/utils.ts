// function for adding a zero in front of the number if it is < 10
export const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);
