import { Injectable } from '@angular/core';

export interface AppConfig {
  env: { 
    url: string 
  };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _config: AppConfig | null = null;

  setConfig(config: AppConfig) {
    this._config = config;
  }

  get config(): AppConfig {
    if (!this._config) {
      throw new Error("Config not loaded");
    }
    return this._config;
  }

  get env(): AppConfig['env'] {
    if (!this._config) {
      throw new Error("Config not loaded");
    }
    return this._config.env;
  }
}