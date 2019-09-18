var image = new Image();
image.onload = function () {
    document.getElementById('main-logo').setAttribute('src', this.src);
};
image.src = './image/logo.png';

const assets = [
    { id: 'main-logo', src: '../image/logo.png' },
    { id: 'babyCtlulhuEarth', src: '../image/chubby.png' }
];

assets.forEach((asset) => {
    const img = new Image();
    img.onload = () => {
        document.getElementById(asset.id).setAttribute('src', this.src);
    }
    img.src = asset.src;
    debugger;
})