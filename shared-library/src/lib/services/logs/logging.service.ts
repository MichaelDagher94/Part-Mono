import { inject, Inject, Injectable } from '@angular/core';
import { NgxLoggerLevel } from 'ngx-logger';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { HttpBaseService } from '../http-base.service';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logLevel: NgxLoggerLevel;
  private serverLogLevel: NgxLoggerLevel;
  private serverLoggingUrl: string;
  private timestampFormat: string;
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(
    private http: HttpBaseService
  ) {
    const { loggingConfig } = this.config;
    this.logLevel = loggingConfig.logLevel;
    this.serverLogLevel = loggingConfig.serverLogLevel;
    this.serverLoggingUrl = loggingConfig.serverLoggingUrl;
    this.timestampFormat = loggingConfig.timestampFormat;
  }

  public debug(message: string, ...additional: any[]): void {
    this.logMessage(NgxLoggerLevel.DEBUG, message, additional);
  }

  public info(message: string, ...additional: any[]): void {
    this.logMessage(NgxLoggerLevel.INFO, message, additional);
  }

  public warn(message: string, ...additional: any[]): void {
    this.logMessage(NgxLoggerLevel.WARN, message, additional);
  }

  public error(message: string, ...additional: any[]): void {
    this.logMessage(NgxLoggerLevel.ERROR, message, additional);
  }

  private logMessage(level: NgxLoggerLevel, message: string, additional: any[] = []): void {
    if (level >= this.logLevel) {
      this.logToConsole(level, message, additional);
    }
    if (level >= this.serverLogLevel && this.serverLoggingUrl) {
      this.logToServer(level, message, additional);
    }
  }

  private logToConsole(level: NgxLoggerLevel, message: string, additional: any[]): void {
    const timeStamp = this.getTimeStamp();
    switch (level) {
      case NgxLoggerLevel.ERROR:
        console.error(`[${timeStamp}][ERROR]: ${message}`, ...additional);
        break;
      case NgxLoggerLevel.WARN:
        console.warn(`[${timeStamp}][WARN]: ${message}`, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`[${timeStamp}][INFO]: ${message}`, ...additional);
        break;
      default:
        console.log(`[${timeStamp}][DEBUG]: ${message}`, ...additional);
        break;
    }
  }

  private logToServer(level: NgxLoggerLevel, message: string, additional: any[]): void {
    const payload = {
      level: NgxLoggerLevel[level],
      message,
      additional,
      timestamp: this.getTimeStamp()
    };

    this.http.post(this.serverLoggingUrl, payload).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Failed to log to server', err);
      }
    });
  }

  private getTimeStamp(): string {
    const now = new Date();
    if (this.timestampFormat === 'short') {
      return now.toLocaleString();
    }
    return now.toISOString();
  }
}
