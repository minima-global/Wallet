const useSlice = () => {
    const s = (value: string, { start = 4, end = 16 }: { start?: number, end?: number } = { start: 4, end: 16 }) => {
        const startValue = value.slice(0, start);
        const endValue = value.slice(-end);
        return `${startValue}...${endValue}`;
    }

    return {
        s,
    }
}

export default useSlice;