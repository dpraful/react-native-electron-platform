import webpack from 'webpack';
const defaultOptions = {
    appName: 'React Native',
    colors: {
        green: '\x1b[38;5;46m',
        blue: '\x1b[38;5;39m',
        gray: '\x1b[38;5;244m',
        white: '\x1b[97m',
        whiteBright: '\x1b[1;97m',
        reactGreen: '\x1b[38;5;48m',
        reset: '\x1b[0m',
        bold: '\x1b[1m',
    },
};
export function createProgressPlugin(options = {}) {
    const opts = {
        ...defaultOptions,
        ...options,
    };
    opts.colors = {
        ...defaultOptions.colors,
        ...(options.colors || {}),
    };
    let rendered = false;
    let startTime = Date.now();
    let lastPercent = -1;
    let lastMessage = '';
    const spinnerFrames = [
        '⠋',
        '⠙',
        '⠹',
        '⠸',
        '⠼',
        '⠴',
        '⠦',
        '⠧',
        '⠇',
        '⠏',
    ];
    let spinnerIndex = 0;
    return new webpack.ProgressPlugin((percentage, message, ...args) => {
        const percent = Math.floor(percentage * 100);
        if (percent === lastPercent &&
            message === lastMessage &&
            percentage !== 1) {
            return;
        }
        lastPercent = percent;
        lastMessage = message;
        const { green, blue, gray, white, whiteBright, reactGreen, reset, bold, } = opts.colors;
        spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
        const spinner = spinnerFrames[spinnerIndex];
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const elapsed = minutes > 0
            ? `${minutes}m ${seconds}s`
            : `${seconds}s`;
        let stage = 'INITIALIZING';
        if (percent >= 10)
            stage = 'PREPARING';
        if (percent >= 25)
            stage = 'CONFIGURING';
        if (percent >= 45)
            stage = 'COMPILING';
        if (percent >= 65)
            stage = 'BUNDLING';
        if (percent >= 85)
            stage = 'OPTIMIZING';
        if (percent >= 95)
            stage = 'FINALIZING';
        let detail = message || 'Evaluating settings';
        if (args.length > 0) {
            const extra = args
                .filter(Boolean)
                .join(' ')
                .trim();
            if (extra) {
                detail += ` > ${extra}`;
            }
        }
        // Progress bar parts
        const filled = Math.floor(percent / 8);
        const empty = 12 - filled;
        // White < and >
        // Green ========
        // Gray --------
        const progressIndicator = `${whiteBright}<${reset}` +
            `${reactGreen}${'='.repeat(filled)}${reset}` +
            `${gray}${'-'.repeat(empty)}${reset}` +
            `${whiteBright}>${reset}`;
        const line1 = `${green}${spinner}${reset} ` +
            `${bold}${white}info${reset} ` +
            `${white}Installing the app...${reset}`;
        const line2 = `${white}${detail}${reset}`;
        const line3 = `${progressIndicator} ` +
            `${bold}${white}${percent}%${reset} ` +
            `${bold}${white}${stage}${reset} ` +
            `${bold}${white}[${elapsed}]${reset}`;
        if (rendered) {
            process.stdout.write('\x1b[3F');
        }
        process.stdout.write('\x1b[2K\r');
        process.stdout.write(line1 + '\n');
        process.stdout.write('\x1b[2K\r');
        process.stdout.write(line2 + '\n');
        process.stdout.write('\x1b[2K\r');
        process.stdout.write(line3 + '\n');
        rendered = true;
    });
}
