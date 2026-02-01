import { Injectable } from '@angular/core';

export interface AppConfig {
  env: { 
    url: string 
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _config: AppConfig | null = null;

  setConfig(config: AppConfig) {
    this._config = config;
  }

  getConfig(): AppConfig {
    if (!this._config) {
      throw new Error("Config not loaded");
    }
    return this._config;
  }
}
