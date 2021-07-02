const randomColor = function (r, g, b, a) {
    const red = r || Math.floor(Math.random() * 256);
    const green = g || Math.floor(Math.random() * 256);
    const blue = b || Math.floor(Math.random() * 256);
    const alpha = a || Math.random();
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

class Dataset {
    constructor(label, data, bgColor, bdrColor, tension) {
        this.label = label || '';
        this.data = data || [];
        this.backgroundColor = bgColor || randomColor();
        this.borderColor = bdrColor || randomColor();
        this.tension = tension || 0.5;
    }
}

export { randomColor, Dataset };