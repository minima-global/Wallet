const useSlice = () => {
    const s = (value: string, { start = 4, end = 16 }: { start?: number, end?: number } = { start: 4, end: 16 }) => {
        if (value.length <= start + end) {
            return value;
        }s

        const startValue = value.slice(0, start);
        const endValue = value.slice(-end);
        return `${startValue}...${endValue}`;
    }

    const m = (value: string | undefined, maxLength: number = 24) => {
        if (!value) {
            return '';
        }

        if (value.length <= maxLength) {
            return value;
        }

        return value.slice(0, maxLength) + '...';
    }

    return {
        s,
        m,
    }
}

export default useSlice;