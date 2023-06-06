import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;
import config from "../config/config.js";
import { __dirname } from "../utils.js";

const ENVIRONMENT = config.node_env;
const logsPath = `${__dirname}/logger/logs`;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
  },
};

const customTimestamp = { format: "DD-MM-YYYY T hh:mm:ss A" };

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level.toLocaleUpperCase()}: ${message}`;
});

let logger;

if (ENVIRONMENT === "production") {
  logger = createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new transports.Console({
        level: "info",
        format: combine(
          timestamp(customTimestamp),
          customFormat,
          colorize({
            all: true,
            colors: customLevelOptions.colors,
          })
        ),
      }),
      new transports.File({
        filename: `${logsPath}/errors.log`,
        level: "error",
        format: combine(timestamp(customTimestamp), customFormat),
      }),
    ],
  });
} else {
  logger = createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new transports.Console({
        level: "debug",
        format: combine(
          timestamp(customTimestamp),
          customFormat,
          colorize({
            all: true,
            colors: customLevelOptions.colors,
          })
        ),
      }),
    ],
  });
}

export default logger;
