enum Platforms {
    Windows = 1,
    Linux = 2,
    MacOS = 3,
    Switch = 4,
    Xbox = 5,
    PlayStation = 6,
    Android = 7
}

const Values = Object.keys(Platforms).filter((item) => {
    return !isNaN(Number(item));
}).map(x => Number(x));

function GetPlatformText(platform: Platforms) {
    switch(platform) {
        case Platforms.Windows: return "Windows";
        case Platforms.Linux: return "Linux";
        case Platforms.MacOS: return "MacOS";
        case Platforms.Switch: return "Nintendo Switch";
        case Platforms.Xbox: return "Xbox";
        case Platforms.PlayStation: return "PlayStation";
        case Platforms.Android: return "Android";
    }
}

function GetPlatformIcon(platform: Platforms) {
    switch(platform) {
        case Platforms.Windows: return "windows";
        case Platforms.Linux: return "linux";
        case Platforms.MacOS: return "apple";
        case Platforms.Switch: return "nintendo-switch";
        case Platforms.Xbox: return "microsoft-xbox";
        case Platforms.PlayStation: return "sony-playstation";
        case Platforms.Android: return "android";
    }
}

export default Platforms;
export {
    GetPlatformText,
    GetPlatformIcon,
    Values
}