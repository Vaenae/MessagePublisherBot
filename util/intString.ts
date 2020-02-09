export type IntString = string

export const toInt = (str: IntString): number => parseInt(str, 10)

export const toIntString = (value: number): IntString => value.toString(10)
