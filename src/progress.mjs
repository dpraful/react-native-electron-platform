import webpack from 'webpack';

const defaultOptions = {
  width: 24,
  label: 'Building',
  detailPrefix: 'Compiling',
  colors: {
    bar: '\x1b[32m',
    info: '\x1b[34m',
    percent: '\x1b[33m',
    reset: '\x1b[0m',
  },
};

export function createProgressPlugin(options = {}) {
  const opts = { ...defaultOptions, ...options };
  opts.colors = { ...defaultOptions.colors, ...(options.colors || {}) };

  let initialPrinted = false;

  return new webpack.ProgressPlugin((percentage, message, ...args) => {
    const percent = Math.round(percentage * 100);
    const complete = Math.round(percentage * opts.width);
    const green = opts.colors.bar;
    const blue = opts.colors.info;
    const yellow = opts.colors.percent;
    const reset = opts.colors.reset;

    const blocks = '█'.repeat(complete);
    const empties = ' '.repeat(Math.max(0, opts.width - complete));
    const bar = `${green}${blocks}${reset}${empties}`;

    let detailText = message || 'starting...';
    if (args && args.length > 0) {
      const info = args.join(' ');
      if (info.length > 0) {
        detailText = `${detailText} ${info}`;
      }
    }
    const detail = `${blue}${opts.detailPrefix}:${reset} ${detailText}`;
    const text = `${blue}${opts.label}${reset} [${bar}] ${yellow}${percent}%${reset}`;

    if (initialPrinted) {
      process.stdout.write('\x1b[2A');
    }
    process.stdout.write(`\x1b[2K\r${detail}\n\x1b[2K\r${text}\n`);
    initialPrinted = true;

    if (percentage === 1) {
      process.stdout.write('\n');
    }
  });
}
