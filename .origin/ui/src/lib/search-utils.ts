export function generateRegExp(value: string): RegExp {
    const regexSplit: string[] = value.split(" ").filter((v) => v !== "");
    try {
        return new RegExp("(?=.*" + regexSplit.join(")(?=.*") + ")", "i");
    } catch {
        return new RegExp(
            "(?=.*" +
                regexSplit
                    .map((part) => part.replace(/[()]/g, "\\$&")) // $& means the whole matched string
                    .join(")(?=.*") +
                ")",
            "i",
        );
    }
}
