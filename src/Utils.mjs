export function DJB2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return (hash >>> 0) ^ str.length;
}


export const assignConfig = (config, defaultConfig) => {
    for (let key in defaultConfig) {
        if (!config.hasOwnProperty(key)) {
            config[key] = defaultConfig[key]
        }
    }
    return config
}