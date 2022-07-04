/**
 * log4js 配置文件
 *
 * 日志等级由低到高
 * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF.
 *
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 */

var path = require("path");

//日志根目录
var baseLogPath = path.resolve(__dirname, "../logs");

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

var appLogPath = baseLogPath + "/main";

module.exports = {
  appenders: {
    //错误日志
    errorLogger: {
      type: "dateFile", //日志类型
      filename: errorLogPath, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: "yyyy-MM-dd-hh.log", //后缀，每小时创建一个新的日志文件
      path: errorPath, //自定义属性，错误日志的根目录
    },
    //响应日志
    resLogger: {
      type: "dateFile",
      filename: responseLogPath,
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd-hh.log",
      category: "resLogger",
      path: responsePath,
    },
    app: {
      type: "dateFile",
      filename: appLogPath,
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd-hh.log"
    },
  },
  //设置logger名称对应的的日志等级
  categories: {
    default: { appenders: ["app"], level: "DEBUG" },
    errorLogger: { appenders: ["errorLogger"], level: "ERROR" },
    resLogger: { appenders: ["resLogger"], level: "DEBUG" },
  },
};
