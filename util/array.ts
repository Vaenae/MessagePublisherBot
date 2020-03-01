export function getFirstIfArray<T>(input: T | ReadonlyArray<T>): T {
    return Array.isArray(input) ? input[0] : input
}
